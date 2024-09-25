import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  secretNumber: number;

  @Column({ default: false })
  isGuessed: boolean;

  @Column({ nullable: true })
  attempts: number;
}
