'use strict';

import Base from './base';
import axios from 'axios';
import fs from 'fs';
import debug from '@byted-dino/debug';
import { getReadableFileSizeString } from '../utils';

const TINYPNG_URL = 'https://tinypng.com/web/shrink';

export default class TinyImageMin extends Base {
  /**
   * 压缩图片
   * @param src 源图片路径
   * @param dist 目标图片路径
   */
  async compressImage(src: string, dist: string): Promise<void> {
    const stream = fs.createReadStream(src);
    debug.log('start tiny compress ', src);

    return new Promise((resolve, reject) => {
      axios
        .post(TINYPNG_URL, stream)
        .then(async (res) => {
          if (res && res.data) {
            const data: TinyPngResponse = res.data;
            await this._downloadFile(data, dist);
            resolve();
          }
        })
        .catch(() => {
          reject(new Error(`tiny compress fail: ${src}, it will use imagemin compress`));
        });
    });
  }

  /**
   * 下载压缩后的图片
   * @param data TinyPNG 返回的数据
   * @param dist 目标路径
   */
  private async _downloadFile(data: TinyPngResponse, dist: string): Promise<void> {
    const { url } = data.output;
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(dist);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        const inputSize = getReadableFileSizeString(data.input.size);
        const outputSize = getReadableFileSizeString(data.output.size);
        debug.log(
          '压缩成功',
          `原始大小:${inputSize}`,
          `压缩大小:${outputSize}`,
          `优化比例:${data.output.ratio}`,
        );
        resolve();
      });

      writer.on('error', (err) => {
        debug.error(err);
        reject(err);
      });
    });
  }
}

/**
 * TinyPNG API 响应数据类型
 */
interface TinyPngResponse {
  input: {
    size: number;
    type: string;
  };
  output: {
    size: number;
    type: string;
    width: number;
    height: number;
    ratio: number;
    url: string;
  };
}

