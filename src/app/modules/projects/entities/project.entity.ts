import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectCategory } from '../../project-categories/entities/project-category.entity';

@Entity({ name: 'projects' })
export class Project {
  /**
   * Primary Key - Unique ID for each team member
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Full name of the team member
   */
  @Column({ type: 'varchar', nullable: false })
  project_title: string;

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
  project_description: string;

  /**
   * Short biography or description
   */
  @Column({ type: 'varchar', nullable: false })
  project_tags: string;

  /**
   * Short biography or description
   */
  @Column({ type: 'varchar', nullable: false })
  publish_time: string;

  /**
   * Foreign key referencing the designation of the team member
   */
  @Column({ type: 'bigint' })
  project_category_id: string;

  @ManyToOne(() => ProjectCategory, {
    nullable: false,
  })
  @JoinColumn({ name: 'project_category_id' })
  projectCategory: ProjectCategory;

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
