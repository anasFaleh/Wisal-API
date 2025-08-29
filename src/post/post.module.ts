import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { PostsController } from './post.controller';

@Module({
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostModule {}
