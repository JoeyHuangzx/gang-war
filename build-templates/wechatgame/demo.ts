import * as fs from 'fs';
import * as path from 'path';

// 遍历文件夹
export function traverseFolder(folderPath: string) {
  // 读取文件夹中的所有文件和子文件夹
  const files = fs.readdirSync(folderPath);
  // 遍历文件和子文件夹
  files.forEach((file: string) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    // 如果是文件，则输出文件名
    if (stats.isFile()) {
      console.log(file);
    }
    // 如果是文件夹，则递归遍历子文件夹
    else if (stats.isDirectory()) {
      traverseFolder(filePath);
    }
  });
}
