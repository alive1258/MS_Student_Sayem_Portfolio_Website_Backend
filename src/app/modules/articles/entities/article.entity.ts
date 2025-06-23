import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ArticleCategory } from '../../article-categories/entities/article-category.entity';

@Entity({ name: 'articles' })
export class Article {
  /**
   * Primary Key - Unique ID for each team member
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Full name of the team member
   */
  @Column({ type: 'varchar', nullable: false })
  article_title: string;

  /**
   * Unique slug for the team member (used in URLs)
   */
  @Column({ type: 'varchar', nullable: false })
  slug: string;

  /**
   * Profile photo URL (optional)
   */
  @Column({ type: 'varchar', nullable: true })
  thumbnail?: string;

  /**
   * Short biography or description
   */
  @Column({ type: 'varchar', nullable: false })
  article_description: string;
  /**
   * Short biography or description
   */
  @Column({ type: 'varchar', nullable: true })
  article_tags?: string;
  /**
   * Short biography or description
   */
  @Column({ type: 'varchar', nullable: false })
  publish_time: string;

  /**
   * Foreign key referencing the designation of the team member
   */
  @Column({ type: 'bigint' })
  article_category_id: string;

  @ManyToOne(() => ArticleCategory, {
    nullable: false,
  })
  @JoinColumn({ name: 'article_category_id' })
  articleCategory: ArticleCategory;

  /**
   * User ID of the person who added the team member
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp of when the record was created
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  /**
   * Timestamp of the last update to the record
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
