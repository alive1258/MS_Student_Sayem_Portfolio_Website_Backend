import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'about_me' })
export class AboutMe {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'text' })
  title: string;

  /**
   * Short description or tagline shown in the hero section.
   */
  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  sub_title: string;

  @Column({ type: 'text' })
  skills: string[];

  /**
   * Link to the CV or portfolio (optional).
   */
  @Column({ type: 'varchar', nullable: true })
  cv_link?: string;

  /**
   * Photo filename or image URL (optional).
   */
  @Column({ type: 'bigint', nullable: true })
  photo?: string;

  /**
   * ID of the user who added this record.
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp when the entry was created.
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * Timestamp when the entry was last updated.
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
