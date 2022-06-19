/**
 * 曲情報を格納するDTO
 */
export default class SongInfoData {
  private id: string;
  private title: string;
  private artist: string;
  private imgUrl: string;

  /**
   * コンストラクタ
   * @param {number} id - youtubeのid
   * @param {string} title - 曲名
   * @param {string} artist - アーティスト名
   * @param {string} imgUrl - 曲のサムネイル画像のURL
   */
  constructor(id: string, title: string, artist: string, imgUrl: string) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.imgUrl = imgUrl;
  }

  /**
   * @readonly
   * @type {string}
   * @memberof SongInfoData
   */
  get Id(): string {
    return this.id;
  }

  /**
   * @readonly
   * @type {string}
   * @memberof SongInfoData
   */
  get Title(): string {
    return this.title;
  }

  /**
   * @readonly
   * @type {string}
   * @memberof SongInfoData
   */
  get Artist(): string {
    return this.artist;
  }

  /**
   * @readonly
   * @type {string}
   * @memberof SongInfoData
   */
  get ImgUrl(): string {
    return this.imgUrl;
  }
}
