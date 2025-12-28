/**
 * Cloudflare Worker for Telegram Study Planner Bot
 * Based on: https://dev.to/msarabi/deploying-your-telegram-bots-on-cloudflare-workers-a-step-by-step-guide-3cdk
 */

export interface Env {
  TOKEN: string;
  SECRET: string;
  TELEGRAM_WEBAPP_URL: string;
  USER_DATA?: KVNamespace; // Optional KV namespace for persistent storage
}

// In-memory storage (use KV in production)
const userData = new Map<number, any>();
const studyPlans = new Map<number, any>();

// Task model interface
interface Task {
  id: string;
  day: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

// Helper function to generate unique task ID
function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// AI Service for generating study plans
class AIService {
  generateStudyPlan(userInput: any) {
    const { availableHours, examDate, subjects, difficulty } = userInput;
    const daysUntilExam = Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const hoursPerDay = availableHours / 7;
    
    const plan = {
      dailySchedule: [] as any[],
      weeklyGoals: [] as string[],
      recommendations: [] as string[]
    };

    // Generate daily schedule with task objects (Phase 3)
    for (let i = 0; i < 7; i++) {
      const dayNum = i + 1;
      const task1: Task = {
        id: generateTaskId(),
        day: dayNum,
        text: `${subjects[0] || 'Subject 1'}: Review and practice`,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const task2: Task = {
        id: generateTaskId(),
        day: dayNum,
        text: `${subjects[1] || 'Subject 2'}: Study new material`,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      plan.dailySchedule.push({
        day: dayNum,
        subjects: subjects.slice(0, 2),
        hours: hoursPerDay,
        tasks: [task1, task2]  // Now tasks are objects with IDs
      });
    }

    // Generate weekly goals
    plan.weeklyGoals = [
      `Complete ${subjects.length} subject reviews`,
      `Practice ${hoursPerDay * 7} hours total`,
      `Take 2 practice tests`
    ];

    // Generate recommendations
    plan.recommendations = [
      `Focus on ${difficulty === 'hard' ? 'advanced' : 'fundamental'} concepts`,
      `Take breaks every ${Math.floor(hoursPerDay)} hours`,
      `Review previous day's material for 30 minutes daily`
    ];

    return plan;
  }
  
  // Migrate old plan format (string tasks) to new format (task objects)
  migratePlan(plan: any): any {
    if (!plan || !plan.dailySchedule) return plan;
    
    const migrated = { ...plan };
    migrated.dailySchedule = plan.dailySchedule.map((day: any) => {
      if (!day.tasks || day.tasks.length === 0) return day;
      
      // Check if tasks are strings (old format)
      if (typeof day.tasks[0] === 'string') {
        // Migrate to task objects
        return {
          ...day,
          tasks: day.tasks.map((taskText: string, index: number) => {
            const task: Task = {
              id: generateTaskId(),
              day: day.day,
              text: taskText,
              completed: false,  // Will check completedTasks map if exists
              createdAt: new Date().toISOString()
            };
            
            // Check if task was completed (using old completedTasks map)
            if (plan.completedTasks) {
              const oldKey = `${day.day}-${index}`;
              if (plan.completedTasks[oldKey]) {
                task.completed = true;
              }
            }
            
            return task;
          })
        };
      }
      
      // Already in new format, but ensure all tasks have required fields
      return {
        ...day,
        tasks: day.tasks.map((task: any) => {
          // Safely extract text - prevent [object Object] issues
          let taskText: string;
          if (typeof task === 'string') {
            taskText = task;
          } else if (task && typeof task.text === 'string') {
            taskText = task.text;
          } else if (task && task.text !== null && task.text !== undefined) {
            taskText = String(task.text);
          } else {
            taskText = ''; // Fallback to empty string
          }
          
          return {
            id: task.id || generateTaskId(),
            day: task.day || day.day,
            text: taskText,
            completed: task.completed === true, // Use strict boolean check
            createdAt: task.createdAt || new Date().toISOString()
          };
        })
      };
    });
    
    // Remove old completedTasks map (completion is now in task.completed)
    if (migrated.completedTasks) {
      delete migrated.completedTasks;
    }
    
    return migrated;
  }
}

const aiService = new AIService();

// Telegram API helper
class TelegramAPI {
  constructor(public token: string) {}

  async sendMessage(chatId: number, text: string, options?: any) {
    const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
    const body = {
      chat_id: chatId,
      text,
      ...options
    };

    console.log(`[TelegramAPI] Sending message to chat ${chatId}`);
    console.log(`[TelegramAPI] URL: ${url}`);
    console.log(`[TelegramAPI] Body:`, JSON.stringify(body, null, 2));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      
      if (!result.ok) {
        console.error(`[TelegramAPI] Error sending message:`, result);
        console.error(`[TelegramAPI] Error code: ${result.error_code}, Description: ${result.description}`);
      } else {
        console.log(`[TelegramAPI] Message sent successfully:`, result.result.message_id);
      }

      return result;
    } catch (error) {
      console.error(`[TelegramAPI] Network error:`, error);
      throw error;
    }
  }

  async answerCallbackQuery(queryId: string, text?: string) {
    const url = `https://api.telegram.org/bot${this.token}/answerCallbackQuery`;
    const body: any = { callback_query_id: queryId };
    if (text) body.text = text;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    return response.json();
  }

  async editMessageReplyMarkup(chatId: number, messageId: number) {
    const url = `https://api.telegram.org/bot${this.token}/editMessageReplyMarkup`;
    const body = {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: undefined
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    return response.json();
  }

  async sendInvoice(chatId: number, invoice: any) {
    const url = `https://api.telegram.org/bot${this.token}/sendInvoice`;
    const body = {
      chat_id: chatId,
      ...invoice
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    return response.json();
  }

  async setWebhook(url: string, secret?: string) {
    const webhookUrl = `https://api.telegram.org/bot${this.token}/setWebhook`;
    const body: any = { url };
    if (secret) body.secret_token = secret;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    return response.json();
  }
}

// Handle /start command
async function handleStartCommand(chatId: number, userId: number, tg: TelegramAPI, env: Env) {
  console.log(`[handleStartCommand] Starting for user ${userId}, chat ${chatId}`);
  
  try {
    // Initialize user data
    let user = userData.get(userId);
    if (!user) {
      user = {
        language: 'en',
        stars: 0,
        premium: false,
        studyPlan: null,
        progress: [],
        completedTasks: {}
      };
      userData.set(userId, user);
      console.log(`[handleStartCommand] Created new user data for ${userId}`);
    }

    const welcomeText = user.language === 'fa' 
      ? 'خوش آمدید! برنامه‌ریزی مطالعه خود را شروع کنید.'
      : user.language === 'ru'
      ? 'Добро пожаловать! Начните планировать свое обучение.'
      : 'Welcome! Start planning your studies.';

    const webAppUrl = `${env.TELEGRAM_WEBAPP_URL}/index.html`;
    console.log(`[handleStartCommand] WebApp URL: ${webAppUrl}`);

    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📚 Open Study Planner', web_app: { url: webAppUrl } }],
          [{ text: '⭐ Buy Stars', callback_data: 'buy_stars' }],
          [{ text: '📊 View Progress', callback_data: 'view_progress' }]
        ]
      }
    };

    console.log(`[handleStartCommand] Sending message with options:`, JSON.stringify(options, null, 2));
    const result = await tg.sendMessage(chatId, welcomeText, options);
    console.log(`[handleStartCommand] Message sent, result:`, result);
    
    return result;
  } catch (error) {
    console.error(`[handleStartCommand] Error:`, error);
    throw error;
  }
}

// Handle /help command
async function handleHelpCommand(chatId: number, userId: number, tg: TelegramAPI) {
  const user = userData.get(userId) || { language: 'en' };
  
  const helpText = user.language === 'fa'
    ? 'دستورات:\n/start - شروع\n/buy_star - خرید ستاره\n/help - راهنما'
    : user.language === 'ru'
    ? 'Команды:\n/start - Начать\n/buy_star - Купить звезды\n/help - Помощь'
    : 'Commands:\n/start - Start\n/buy_star - Buy Stars\n/help - Help';

  await tg.sendMessage(chatId, helpText);
}

// Handle callback queries
async function handleCallbackQuery(callbackQuery: any, tg: TelegramAPI, env: Env) {
  const data = callbackQuery.data;
  const messageId = callbackQuery.message?.message_id;
  const chatId = callbackQuery.message?.chat.id;
  const userId = callbackQuery.from.id;

  if (data === 'buy_stars') {
    await handleBuyStars(chatId, tg);
  } else if (data === 'view_progress') {
    await handleViewProgress(chatId, userId, tg);
  }

  await tg.answerCallbackQuery(callbackQuery.id);
}

// Handle buying stars
async function handleBuyStars(chatId: number, tg: TelegramAPI) {
  await tg.sendInvoice(chatId, {
    title: 'Purchase Stars',
    description: 'Unlock premium study features',
    payload: 'stars_purchase',
    provider_token: 'YOUR_PROVIDER_TOKEN', // Set up with payment provider
    currency: 'USD',
    prices: [{ label: '5 Stars', amount: 100 }] // Amount in cents
  });
}

// Handle view progress
async function handleViewProgress(chatId: number, userId: number, tg: TelegramAPI) {
  const user = userData.get(userId);
  if (!user || !user.progress || user.progress.length === 0) {
    const text = user?.language === 'fa' 
      ? 'هنوز پیشرفتی ثبت نشده است.'
      : user?.language === 'ru'
      ? 'Прогресс еще не зарегистрирован.'
      : 'No progress recorded yet.';
    await tg.sendMessage(chatId, text);
    return;
  }

  const totalSessions = user.progress.length;
  const avgProgress = user.progress.reduce((sum: number, p: any) => sum + (p.completed || 0), 0) / totalSessions;
  
  const text = user.language === 'fa'
    ? `جلسات کل: ${totalSessions}\nمیانگین پیشرفت: ${Math.round(avgProgress)}%`
    : user.language === 'ru'
    ? `Всего сессий: ${totalSessions}\nСредний прогресс: ${Math.round(avgProgress)}%`
    : `Total Sessions: ${totalSessions}\nAverage Progress: ${Math.round(avgProgress)}%`;

  await tg.sendMessage(chatId, text);
}

// Handle successful payment
async function handleSuccessfulPayment(message: any, tg: TelegramAPI) {
  const chatId = message.chat.id;
  const userId = message.from.id;
  const user = userData.get(userId) || { stars: 0 };
  
  // Add stars based on payment
  const amount = message.successful_payment.total_amount;
  const starsToAdd = Math.floor(amount / 20); // 1 star per 20 cents
  
  user.stars = (user.stars || 0) + starsToAdd;
  userData.set(userId, user);

  await tg.sendMessage(chatId, `✅ Payment successful! You received ${starsToAdd} stars.`);
}

// Handle pre-checkout query
async function handlePreCheckoutQuery(query: any, token: string) {
  const url = `https://api.telegram.org/bot${token}/answerPreCheckoutQuery`;
  // In production, validate the payment here before approving
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pre_checkout_query_id: query.id,
      ok: true
    })
  });
  return response.json();
}

// API Routes handler
async function handleAPIRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // User data endpoints
  if (path.startsWith('/api/user/')) {
    const parts = path.split('/').filter(p => p); // Remove empty parts
    const userId = parseInt(parts[2]); // parts[0]='api', parts[1]='user', parts[2]=userId
    const endpoint = parts[3] || ''; // parts[3]='study-plan' or 'tasks' etc
    const subEndpoint = parts[4] || ''; // parts[4] for nested routes like tasks/:taskId

    if (request.method === 'GET' && !endpoint) {
      // Get user data
      const user = userData.get(userId) || {
        language: 'en',
        stars: 0,
        premium: false,
        studyPlan: null,
        progress: [],
        completedTasks: {}
      };
      return new Response(JSON.stringify(user), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'POST' && endpoint === 'language') {
      // Update language
      const body = await request.json();
      const language = body.language;
      
      const user = userData.get(userId) || {
        language: 'en',
        stars: 0,
        premium: false,
        studyPlan: null,
        progress: [],
        completedTasks: {}
      };
      
      user.language = language;
      userData.set(userId, user);
      
      return new Response(JSON.stringify({ success: true, language }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'POST' && endpoint === 'study-plan') {
      // Generate study plan
      const body = await request.json();
      // Get or create user (fix: don't return 404 if user doesn't exist, create one)
      let user = userData.get(userId);
      if (!user) {
        user = {
          language: 'en',
          stars: 0,
          premium: false,
          studyPlan: null,
          progress: [],
          completedTasks: {}
        };
        userData.set(userId, user);
      }

      // Free plan - no stars required for now
      // const starsRequired = 5;
      // if (!user.premium && (user.stars || 0) < starsRequired) {
      //   return new Response(JSON.stringify({ 
      //     error: 'Insufficient stars',
      //     required: starsRequired,
      //     current: user.stars || 0
      //   }), {
      //     status: 403,
      //     headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      //   });
      // }

      const plan = aiService.generateStudyPlan(body);
      // Phase 3: Plan already has task objects with IDs, no need for completedTasks map
      user.studyPlan = plan;
      studyPlans.set(userId, plan);
      userData.set(userId, user);

      // Free plan - no stars deduction
      // if (!user.premium) {
      //   user.stars = (user.stars || 0) - starsRequired;
      // }

      return new Response(JSON.stringify({ success: true, plan }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'GET' && endpoint === 'study-plan') {
      // Get study plan - check both user.studyPlan and studyPlans map
      const user = userData.get(userId);
      let plan = null;
      
      // First try to get from user object
      if (user && user.studyPlan) {
        plan = user.studyPlan;
      } else {
        // Fallback to studyPlans map
        plan = studyPlans.get(userId);
      }
      
      if (!plan) {
        return new Response(JSON.stringify({ error: 'No study plan found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Phase 3: Migrate old plan format if needed
      plan = aiService.migratePlan(plan);
      
      // Save migrated plan back
      if (user) {
        user.studyPlan = plan;
        userData.set(userId, user);
      }
      studyPlans.set(userId, plan);
      
      return new Response(JSON.stringify(plan), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Phase 3: Task CRUD endpoints
    // IMPORTANT: Check complete endpoint BEFORE create endpoint to avoid routing conflicts
    // POST /api/user/:userId/tasks/:taskId/complete
    // Path: /api/user/123/tasks/task_123/complete
    // parts: ['api', 'user', '123', 'tasks', 'task_123', 'complete']
    // So parts[3] = 'tasks', parts[4] = taskId, parts[5] = 'complete'
    if (request.method === 'POST' && endpoint === 'tasks' && subEndpoint && parts.length >= 6 && parts[5] === 'complete') {
      // Update task completion status (Phase 3: using taskId from URL)
      const body = await request.json();
      const taskId = subEndpoint; // parts[4] is the taskId
      const { completed } = body;
      const user = userData.get(userId);
      
      if (!user || !user.studyPlan) {
        return new Response(JSON.stringify({ error: 'User or plan not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Migrate plan if needed
      let plan = aiService.migratePlan(user.studyPlan);
      
      // Find task and update completion status
      let found = false;
      for (const daySchedule of plan.dailySchedule) {
        const task = daySchedule.tasks.find((t: any) => t.id === taskId);
        if (task) {
          task.completed = completed === true;
          found = true;
          break;
        }
      }

      if (!found) {
        return new Response(JSON.stringify({ error: 'Task not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      user.studyPlan = plan;
      userData.set(userId, user);
      studyPlans.set(userId, plan);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // POST /api/user/:userId/tasks (create new task)
    // This must come AFTER the complete endpoint check
    if (request.method === 'POST' && endpoint === 'tasks' && !subEndpoint) {
      // Create new task
      const body = await request.json();
      const { day, text } = body;
      
      // Validate input - prevent empty tasks
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return new Response(JSON.stringify({ error: 'Task text cannot be empty' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const user = userData.get(userId);
      
      if (!user || !user.studyPlan) {
        return new Response(JSON.stringify({ error: 'User or plan not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Migrate plan if needed
      let plan = aiService.migratePlan(user.studyPlan);
      
      // Find the day and add task
      const daySchedule = plan.dailySchedule.find((d: any) => d.day === day);
      if (!daySchedule) {
        return new Response(JSON.stringify({ error: 'Day not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const newTask: Task = {
        id: generateTaskId(),
        day: day,
        text: text.trim(), // Trim whitespace
        completed: false,
        createdAt: new Date().toISOString()
      };

      daySchedule.tasks.push(newTask);
      user.studyPlan = plan;
      userData.set(userId, user);
      studyPlans.set(userId, plan);

      return new Response(JSON.stringify({ success: true, task: newTask }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'DELETE' && endpoint === 'tasks' && subEndpoint) {
      // Delete task - endpoint is 'tasks', subEndpoint is the taskId
      // Path: /api/user/123/tasks/task_123
      // parts: ['api', 'user', '123', 'tasks', 'task_123']
      // endpoint = 'tasks', subEndpoint = 'task_123'
      const taskId = subEndpoint;
      const user = userData.get(userId);
      
      if (!user || !user.studyPlan) {
        return new Response(JSON.stringify({ error: 'User or plan not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Migrate plan if needed
      let plan = aiService.migratePlan(user.studyPlan);
      
      // Find and remove task
      let found = false;
      for (const daySchedule of plan.dailySchedule) {
        const taskIndex = daySchedule.tasks.findIndex((t: any) => t.id === taskId);
        if (taskIndex !== -1) {
          daySchedule.tasks.splice(taskIndex, 1);
          found = true;
          break;
        }
      }

      if (!found) {
        return new Response(JSON.stringify({ error: 'Task not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      user.studyPlan = plan;
      userData.set(userId, user);
      studyPlans.set(userId, plan);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Legacy endpoint for backward compatibility (will be removed later)
    if (request.method === 'POST' && endpoint === 'task-complete') {
      // Update task completion status (old format - for compatibility during migration)
      const body = await request.json();
      const { day, taskId, taskIndex, completed } = body;
      const user = userData.get(userId);
      
      if (!user || !user.studyPlan) {
        return new Response(JSON.stringify({ error: 'User or plan not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Migrate plan if needed
      let plan = aiService.migratePlan(user.studyPlan);
      
      // Try to find by taskId first, then by taskIndex (for backward compatibility)
      let found = false;
      if (taskId) {
        for (const daySchedule of plan.dailySchedule) {
          const task = daySchedule.tasks.find((t: any) => t.id === taskId);
          if (task) {
            task.completed = completed === true;
            found = true;
            break;
          }
        }
      } else if (taskIndex !== undefined && day) {
        // Legacy: use day and taskIndex
        const daySchedule = plan.dailySchedule.find((d: any) => d.day === day);
        if (daySchedule && daySchedule.tasks[taskIndex]) {
          daySchedule.tasks[taskIndex].completed = completed === true;
          found = true;
        }
      }

      if (!found) {
        return new Response(JSON.stringify({ error: 'Task not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      user.studyPlan = plan;
      userData.set(userId, user);
      studyPlans.set(userId, plan);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'POST' && endpoint === 'progress') {
      // Save progress
      const body = await request.json();
      const user = userData.get(userId);
      
      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (!user.progress) {
        user.progress = [];
      }
      
      user.progress.push({
        ...body,
        date: new Date().toISOString()
      });
      
      userData.set(userId, user);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'GET' && endpoint === 'progress') {
      // Get progress
      const user = userData.get(userId);
      
      if (!user || !user.progress) {
        return new Response(JSON.stringify({ progress: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ progress: user.progress }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Not Found', { status: 404 });
}

// Serve static files
async function serveStaticFile(path: string, env: Env): Promise<Response | null> {
  // In production, serve these from Cloudflare Pages, R2, or external hosting
  // Option 1: Redirect to your static hosting (recommended)
  if (env.TELEGRAM_WEBAPP_URL && env.TELEGRAM_WEBAPP_URL !== 'https://your-domain.com') {
    if (path === '/index.html' || path === '/') {
      return Response.redirect(`${env.TELEGRAM_WEBAPP_URL}/index.html`, 302);
    }
    // Redirect other static file requests
    if (path.startsWith('/') && (path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js'))) {
      return Response.redirect(`${env.TELEGRAM_WEBAPP_URL}${path}`, 302);
    }
  }
  
  // Option 2: Return helpful message if not configured
  if (path === '/index.html' || path === '/') {
    return new Response(
      `Static files should be hosted separately.\n\n` +
      `Please:\n` +
      `1. Deploy your public/ folder to Cloudflare Pages (or other hosting)\n` +
      `2. Update TELEGRAM_WEBAPP_URL in wrangler.toml\n` +
      `3. Redeploy your Worker\n\n` +
      `See STATIC_FILES_SETUP.md for detailed instructions.`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      }
    );
  }
  return null;
}

// Main worker handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Webhook registration endpoint
    if (path === '/registerWebhook' && request.method === 'GET') {
      if (!env.TOKEN) {
        return new Response('TOKEN is not set! Use: wrangler secret put TOKEN', { status: 500 });
      }
      const tg = new TelegramAPI(env.TOKEN);
      const workerUrl = new URL(request.url);
      workerUrl.pathname = '/webhook';
      await tg.setWebhook(workerUrl.toString(), env.SECRET);
      return new Response('Webhook registered successfully!');
    }

    // Telegram webhook endpoint
    if (path === '/webhook' && request.method === 'POST') {
      // Verify secret token
      const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (secretToken !== env.SECRET) {
        return new Response('Unauthorized', { status: 401 });
      }

      const update = await request.json();
      
      // Debug: Check if TOKEN exists
      console.log('[Webhook] TOKEN exists:', !!env.TOKEN);
      console.log('[Webhook] TOKEN length:', env.TOKEN ? env.TOKEN.length : 0);
      console.log('[Webhook] TOKEN preview:', env.TOKEN ? `${env.TOKEN.substring(0, 10)}...` : 'undefined');
      
      if (!env.TOKEN) {
        console.error('[Webhook] TOKEN is not set!');
        console.error('[Webhook] Available env keys:', Object.keys(env));
        return new Response('TOKEN not configured. Use: wrangler secret put TOKEN', { status: 500 });
      }
      
      const tg = new TelegramAPI(env.TOKEN);

      // Handle message
      if (update.message) {
        try {
          const message = update.message;
          const chatId = message.chat.id;
          const userId = message.from.id;
          const text = message.text;

          console.log(`[Webhook] Received message: ${text} from user ${userId} in chat ${chatId}`);

          if (text === '/start') {
            console.log(`[Webhook] Handling /start command`);
            await handleStartCommand(chatId, userId, tg, env);
            console.log(`[Webhook] /start command handled`);
          } else if (text === '/help') {
            console.log(`[Webhook] Handling /help command`);
            await handleHelpCommand(chatId, userId, tg);
          } else if (text === '/buy_star') {
            console.log(`[Webhook] Handling /buy_star command`);
            await handleBuyStars(chatId, tg);
          }

          // Handle successful payment
          if (message.successful_payment) {
            await handleSuccessfulPayment(message, tg);
          }
        } catch (error) {
          console.error(`[Webhook] Error handling message:`, error);
          // Try to send error message to user
          try {
            await tg.sendMessage(update.message.chat.id, '❌ An error occurred. Please try again.');
          } catch (e) {
            console.error(`[Webhook] Failed to send error message:`, e);
          }
        }
      }

      // Handle callback query
      if (update.callback_query) {
        await handleCallbackQuery(update.callback_query, tg, env);
      }

      // Handle pre-checkout query
      if (update.pre_checkout_query) {
        await handlePreCheckoutQuery(update.pre_checkout_query, env.TOKEN);
        return new Response('OK');
      }

      return new Response('OK');
    }

    // API routes
    if (path.startsWith('/api/')) {
      return handleAPIRequest(request, env);
    }

    // Serve static files (or redirect)
    const staticResponse = await serveStaticFile(path, env);
    if (staticResponse) {
      return staticResponse;
    }

    return new Response('Not Found', { status: 404 });
  }
};

