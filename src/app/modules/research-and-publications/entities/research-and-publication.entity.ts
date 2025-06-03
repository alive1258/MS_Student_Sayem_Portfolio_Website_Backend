import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'research_and_publications' })
export class ResearchAndPublication {
  /**
   * Primary Key - Unique ID for each research/publication item
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Title of the publication
   */
  @Column({ type: 'varchar', nullable: false })
  title: string;

  /**
   * Publisher of the publication
   */
  @Column({ type: 'varchar', nullable: false })
  publisher: string;

  /**
   * Thumbnail image URL (optional)
   */
  @Column({ type: 'varchar', nullable: true })
  thumbnail?: string;

  /**
   * Name of the journal where it was published
   */
  @Column({ type: 'varchar', nullable: false })
  journal: string;

  /**
   * DOI (Digital Object Identifier)
   */
  @Column({ type: 'varchar', nullable: false })
  doi: string;

  /**
   * Tags associated with the publication (comma-separated)
   */
  @Column({ type: 'varchar', nullable: false })
  tags: string;

  /**
   * Link to the paper (PDF or external site)
   */
  @Column({ type: 'varchar', nullable: false })
  paper_link: string;

  /**
   * User ID of the person who added the publication
   */
  @Column({ type: 'bigint', nullable: false })
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
