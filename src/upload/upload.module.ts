import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: './uploads',
    //     __filename: (req, file, callback) => {
    //       const uniqueSuffix =
    //         Date.now() + '-' + Math.round(Math.random() * 1e9);
    //       const ext = extname(file.originalname);
    //       callback(null, `${file.filedname}-${uniqueSuffix}${ext}`);
    //     },
    //     fileFilter: (req, file, callback) => {
    //       if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    //         return callback(new Error('Only image files are allowed!'), false);
    //       }
    //       callback(null, true);
    //     },
    //     limits: {
    //       fileSize: 1024 * 1024 * 5, //max 5mb
    //     },
    //   }),
    // }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
