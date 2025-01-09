import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';
import { DB_CONFIG } from './config';
import { User, News, UserProfile } from './types';
import { 
  CREATE_TABLES, 
  INSERT_USER, 
  SELECT_USER, 
  INSERT_NEWS, 
  SELECT_ALL_NEWS,
  GET_USER_PROFILE,
  TOGGLE_LIKE,
  CHECK_LIKE,
  INCREMENT_VIEW,
  INCREMENT_USER_VIEW,
  DELETE_LIKE
} from './queries';

class Database {
  private static instance: Database;
  private db: any = null;
  private initPromise: Promise<any> | null = null;

  private constructor() {
    this.init().catch(console.error);
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async init() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise(async (resolve, reject) => {
      try {
        const SQL = await initSqlJs(DB_CONFIG);
        const savedData = localStorage.getItem('newsdb');
        
        if (savedData) {
          this.db = new SQL.Database(new Uint8Array(JSON.parse(savedData)));
        } else {
          this.db = new SQL.Database();
          this.db.run(CREATE_TABLES);
        }
        
        resolve(this.db);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        reject(error);
      }
    });

    return this.initPromise;
  }

  private saveToLocalStorage() {
    if (this.db) {
      const data = this.db.export();
      const buffer = new Uint8Array(data);
      localStorage.setItem('newsdb', JSON.stringify(Array.from(buffer)));
    }
  }

  async getAllNews(userId?: number): Promise<News[]> {
    await this.init();
    const result = this.db.exec(SELECT_ALL_NEWS)[0];
    if (!result) return [];

    const news = result.values.map((row: any) => ({
      id: row[0],
      title: row[1],
      content: row[2],
      author_id: row[3],
      created_at: row[4],
      views_count: row[5],
      author_username: row[6],
      likes_count: row[7]
    }));

    if (userId) {
      for (let item of news) {
        const liked = this.db.exec(CHECK_LIKE, [userId, item.id])[0];
        item.isLiked = liked?.values[0][0] > 0;
      }
    }

    return news;
  }

  async getUserProfile(userId: number): Promise<UserProfile | null> {
    await this.init();
    const result = this.db.exec(GET_USER_PROFILE, [userId])[0];
    if (!result) return null;

    const row = result.values[0];
    return {
      id: row[0],
      username: row[1],
      created_at: row[3], // Skip password at index 2
      views_count: row[4],
      published_count: row[5],
      total_views: row[6]
    };
  }

  async registerUser(username: string, password: string): Promise<void> {
    await this.init();
    const hashedPassword = await bcrypt.hash(password, 10);
    this.db.run(INSERT_USER, [username, hashedPassword]);
    this.saveToLocalStorage();
  }

  async loginUser(username: string, password: string): Promise<User | null> {
    await this.init();
    const result = this.db.exec(SELECT_USER, [username])[0];
    if (!result) return null;

    const user = {
      id: result.values[0][0],
      username: result.values[0][1],
      password: result.values[0][2],
      created_at: result.values[0][3]
    };

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createNews(title: string, content: string, authorId: number): Promise<void> {
    await this.init();
    this.db.run(INSERT_NEWS, [title, content, authorId]);
    this.saveToLocalStorage();
  }

  async toggleLike(userId: number, newsId: number): Promise<void> {
    await this.init();
    const liked = this.db.exec(CHECK_LIKE, [userId, newsId])[0];
    if (liked?.values[0][0] > 0) {
      this.db.run(DELETE_LIKE, [userId, newsId]);
    } else {
      this.db.run(TOGGLE_LIKE, [userId, newsId, userId, newsId]);
    }
    this.saveToLocalStorage();
  }

  async incrementNewsViews(newsId: number): Promise<void> {
    await this.init();
    this.db.run(INCREMENT_VIEW, [newsId]);
    this.saveToLocalStorage();
  }
}

const dbOperations = Database.getInstance();
export default dbOperations;