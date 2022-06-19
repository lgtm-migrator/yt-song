import {Request, Response, Router, NextFunction} from 'express';
import fs from 'fs';
import path from 'path';

/* Application */
import SongApplication from '../application/songApplication';

/* Repository */
import SongRepository from '../interface/repository/songRepository';

/* DTO */
import SongInfoData from '../application/dto/songInfoData';

const songApplication = new SongApplication(new SongRepository());

// eslint-disable-next-line new-cap
const router = Router();

const initId = (req: Request, res: Response, next: NextFunction) => {
  const id = songApplication.getID();
  if (id) {
    const fileName = `${id}.mp3`;
    const filePath = path.join(__dirname, '../../downloads', fileName);
    if (fs.existsSync(filePath)) {
      // ファイルを削除
      fs.unlinkSync(filePath);
      songApplication.saveId('');
    }
  }
  next();
};

let origin: string;

const setOrigin = (req: Request, res: Response, next: NextFunction) => {
  origin = `${req.protocol}://${req.headers.host}`;
  next();
};

router.use('/', initId);
router.use('/', setOrigin);

router.get('/', (req: Request, res: Response) => {
  res.render('pages/index', {origin});
});

router.get('/preview', async (req: Request, res: Response) => {
  const url = req.query.url as string;
  if (url === undefined) {
    res.status(400).send('youtubeのidが指定されていません');
    return;
  }
  // urlからyoutubeのidを取得する
  const ytid = url.split('v=')[1];
  try {
    const songData: SongInfoData = await songApplication.getSongInfo(
      ytid as string,
    );
    songApplication.saveId(songData.Id);
    res.render('pages/preview', {songData, origin});
  } catch (e) {
    const err = e as Error;
    console.log(err);
    res.render('pages/error', {err, origin});
  }
});

router.post('/download', async (req: Request, res: Response) => {
  const id = songApplication.getID();

  if (id === '') return res.redirect('/');

  const volumeRange = req.body.volume;
  let volume = 1.0;

  if (isNaN(volumeRange)) return res.redirect('/');
  else volume = Number(volumeRange);

  const title = req.body.title === '' ? 'NONE' : req.body.title;
  const artist = req.body.artist === '' ? '名無しの権兵衛' : req.body.artist;

  const dlPath = await songApplication.downloadSong(
      id,
      volume,
      title,
      artist,
  );
  return res.download(dlPath, `${title}.mp3`);
});

export default router;
