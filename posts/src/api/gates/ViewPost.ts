import { Post } from "../models/Posts/Post";

export class ViewPost {
  
    static can(userId:number, post: Post): boolean {
        return userId == post.user_id;
    }

    static denied(userId:number, post: Post): boolean {
        return !this.can(userId, post);
    }
}