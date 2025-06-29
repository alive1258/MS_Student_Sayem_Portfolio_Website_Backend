import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'send_messages' }) // ✅ Renamed table to plural and meaningful
export class SendMessage {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Sender's full name
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * Sender's email address
   */
  @Column({ type: 'varchar', length: 255 })
  email: string;

  /**
   * Description or message content
   */
  @Column({ type: 'varchar' })
  description: string;

  /**
   * ID of the user who added this record
   */

  /**
   * Timestamp when the entry was created
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  /**
   * Timestamp when the entry was last updated
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
