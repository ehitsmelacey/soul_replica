import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const buildDirectory = path.join(projectRoot, 'dist');
const publicDirectory = path.join(projectRoot, 'public');

await rm(publicDirectory, { recursive: true, force: true });
await mkdir(publicDirectory, { recursive: true });
await cp(buildDirectory, publicDirectory, { recursive: true });

console.log('Copied the Vite site build into public/ for Vercel static hosting.');
