import {ISongRepository} from './repository/ISongRepository';
import SongInfoData from './dto/songInfoData';
import SongModel from '../domain/model/songModel';

import {attachMp3Tag} from '../infrastucture/mp3tag';

/**
 * 曲情報のアプリケーションクラス
 */
export default class SongApplication {
  private songRepository: ISongRepository;

  /**
   * コンストラクタ
   * @param {ISongRepository} songRepository - 曲のリポジトリ
   */
  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  /**
   * youtubeのidから曲情報を取得する
   * @param {string} id youtubeのid
   * @return {Promise<SongInfoData>} 曲情報
   */
  public async getSongInfo(id: string): Promise<SongInfoData> {
    const songInfo = await this.songRepository.getSongInfo(id);
    const songInfoData = new SongInfoData(
        id,
        songInfo.title,
        songInfo.artist,
        songInfo.imgUrl,
    );
    return songInfoData;
  }

  /**
   * 曲をダウンロードする
   * @param {string} id youtubeのid
   * @param {number} volume 音量
   * @param {string} title タイトル
   * @param {string} artist アーティスト名
   * @return {Promise<string>} ダウンロードしたファイルのパス
   */
  public async downloadSong(
      id: string,
      volume: number,
      title: string,
      artist: string,
  ): Promise<string> {
    const songPath = await this.songRepository.downloadSong(id, volume);
    const songModel = new SongModel(id, title, artist, '');
    attachMp3Tag(songPath, songModel);
    return songPath;
  }

  /**
   * idを保存する
   * @param {string} id youtubeのid
   */
  public saveId(id: string) {
    this.songRepository.Id = id;
  }

  /**
   * idを取得する
   * @return {string} id
   */
  public getID(): string {
    return this.songRepository.Id;
  }
}
