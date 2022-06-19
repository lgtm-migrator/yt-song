import NodeID3 from 'node-id3';
import SongModel from '../../domain/model/songModel';

/**
 * mp3のタグ情報を設定する
 * @param {string} filePath ファイルのパス
 * @param {SongModel} songModel 曲の情報
 */
export function attachMp3Tag(filePath: string, songModel: SongModel): void {
  NodeID3.write({
    title: songModel.Title,
    artist: songModel.Artist,
  }, filePath);
}
