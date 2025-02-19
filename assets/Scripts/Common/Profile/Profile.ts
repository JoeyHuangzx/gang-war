/**
 * 通用函数耗时统计工具
 */
export class Profiler {
  static start(tag: string) {
    console.time(tag);
  }

  static end(tag: string) {
    console.timeEnd(tag);
  }
}
