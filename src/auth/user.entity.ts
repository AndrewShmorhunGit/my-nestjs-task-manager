import { Task } from '../tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) //  pg option
  username: string;

  @Column()
  password: string;

  @OneToMany((_type) => Task, (tasks) => tasks.user, { eager: true })
  tasks: Task[];
}
