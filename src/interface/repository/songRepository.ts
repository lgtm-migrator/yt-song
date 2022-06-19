import {ISongInfoObj} from '../../application/repository/ISongInfoObj';
import {ISongRepository} from '../../application/repository/ISongRepository';

import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

/**
 * 曲情報のリポジトリクラス
 */
export default class SongRepository implements ISongRepository {
  private id!: string;
  /**
   * 曲情報を戻す
   * @param {string} id youtubeのid
   * @return {Promise<ISongInfoObj>} 曲情報
   */
  async getSongInfo(id: string): Promise<ISongInfoObj> {
    const data = await ytdl.getInfo(id); // youtubeのデータを取得
    const thumbnails = data.videoDetails.thumbnails; // サムネイル情報
    if (!isNaN(data.videoDetails.lengthSeconds as unknown as number)) {
      const length = Number(data.videoDetails.lengthSeconds); // 曲の長さ
      if (length > 60 * 10) throw new Error('song length is over 10 minutes');
    }
    const songInfo: ISongInfoObj = {
      title: data.videoDetails.title,
      artist: data.videoDetails.author.name,
      imgUrl: thumbnails[thumbnails.length - 1].url,
    };
    return songInfo;
  }

  /**
   *
   *
   * @param {string} id
   * @param {number} volume
   * @return {*}  {Promise<any>}
   * @memberof SongRepository
   */
  async downloadSong(id: string, volume: number): Promise<any> {
    const fileName = `${id}.mp3`;
    const filePath = path.join(__dirname, '../../../downloads', fileName);
    // const fileUrl = 'localhost:8080/downloads/';
    const stream = ytdl(`https://www.youtube.com/watch?v=${id}`, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    const proc = ffmpeg(stream).audioFilters(`volume=${volume}`);

    return new Promise((resolve, reject) => {
      proc
          .on('error', (err) => {
            reject(err);
          })
          .on('end', () => {
            resolve(filePath);
          })
          .save(filePath);
    });
  }

  /**
   *
   * @param {string} id
   * @memberof SongRepository
   */
  set Id(id: string) {
    this.id = id;
  }

  /**
   *
   * @readonly
   * @type {string}
   * @memberof SongRepository
   */
  get Id(): string {
    return this.id === undefined ? '' : this.id;
  }
}
