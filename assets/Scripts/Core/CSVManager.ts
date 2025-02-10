import { _decorator, Component, resources, TextAsset } from 'cc';
import { csvFileName } from '../Datas/CsvConfig';

const { ccclass } = _decorator;

@ccclass('CSVManager')
export class CSVManager {
  private static instance: CSVManager;
  private data: Map<string, any[]> = new Map(); // 存储解析后的数据

  private constructor() {}

  public static getInstance(): CSVManager {
    if (!this.instance) {
      this.instance = new CSVManager();
    }
    return this.instance;
  }

  /**
   * 解析 CSV 文本为对象数组
   * @param csvText CSV 格式的文本
   * @returns 解析后的 JSON 数组
   */
  private parseCSV<T>(csvText: string): T[] {
    const lines = csvText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    if (lines.length < 4) return []; // 至少需要 4 行（字段说明、字段名、字段类型、数据）
    //TODO: 增加字段类型判断
    const headers = lines[2].split(','); // 第三行是字段名
    const dataLines = lines.slice(3); // 从第四行开始是数据

    return dataLines.map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim();
      });
      return obj as T;
    });
  }

  /**
   * 加载并解析 CSV
   * @param fileName CSV 文件名（不带后缀）
   * @returns 解析后的数据
   */
  public async loadCSV<T>(fileName: csvFileName): Promise<T[]> {
    return new Promise((resolve, reject) => {
      resources.load(`datas/${fileName}`, TextAsset, (err, textAsset) => {
        if (err) {
          console.error(`加载 CSV 失败: ${fileName}`, err);
          reject(err);
          return;
        }
        const parsedData = this.parseCSV<T>(textAsset.text);
        this.data.set(fileName, parsedData);
        resolve(parsedData);
      });
    });
  }

  /**
   * 获取已解析的数据
   * @param fileName CSV 文件名
   * @returns 解析后的数据数组
   */
  public getData<T>(fileName: string): T[] {
    return this.data.get(fileName) || [];
  }
}
