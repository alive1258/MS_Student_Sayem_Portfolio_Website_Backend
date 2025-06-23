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

  @Column({ type: 'varchar' })
  title: string;

  /**
   * Short description or tagline shown in the hero section.
   */
  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  sub_title: string;

  @Column('varchar', { array: true })
  skills: string[];

  /**
   * Link to the CV or portfolio (optional).
   */
  @Column({ type: 'varchar', nullable: true })
  cv_link?: string;

  /**
   * Photo filename or image URL (optional).
   */
  @Column({ type: 'varchar', nullable: true })
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
