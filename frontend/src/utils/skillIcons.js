import {
    FaHtml5,
    FaCss3Alt,
    FaJs,
    FaReact,
    FaNode,
    FaPython,
    FaGitAlt,
    FaGithub,
    FaDocker,
    FaAws,
} from 'react-icons/fa';
import {
    SiTailwindcss,
    SiExpress,
    SiMongodb,
    SiFirebase,
    SiNetlify,
    SiVercel,
    SiTypescript,
    SiNextdotjs,
    SiVite,
    SiPostman,
    SiMysql,
    SiPostgresql,
    SiRedis,
    SiGraphql,
    SiBootstrap,
    SiJquery,
    SiSass,
    SiWebpack,
    SiBabel,
    SiNpm,
    SiYarn,
    SiEslint,
    SiPrettier,
    SiFigma,
    SiAdobephotoshop,
    SiAdobeillustrator,
    SiCanva,
} from 'react-icons/si';
import { DiJava } from 'react-icons/di';
import { TbBrandCpp } from 'react-icons/tb';

// Skill icon mapping
export const getSkillIcon = (skillName) => {
    const name = skillName.toLowerCase().trim();

    // HTML/CSS/JS
    if (name.includes('html')) return { icon: FaHtml5, color: '#E34F26' };
    if (name.includes('css')) return { icon: FaCss3Alt, color: '#1572B6' };
    if (name.includes('javascript') || name.includes('js')) return { icon: FaJs, color: '#F7DF1E' };
    if (name.includes('typescript') || name.includes('ts')) return { icon: SiTypescript, color: '#3178C6' };

    // Frameworks & Libraries
    if (name.includes('react')) return { icon: FaReact, color: '#61DAFB' };
    if (name.includes('next')) return { icon: SiNextdotjs, color: '#000000' };
    if (name.includes('vite')) return { icon: SiVite, color: '#646CFF' };
    if (name.includes('tailwind')) return { icon: SiTailwindcss, color: '#06B6D4' };
    if (name.includes('bootstrap')) return { icon: SiBootstrap, color: '#7952B3' };
    if (name.includes('jquery')) return { icon: SiJquery, color: '#0769AD' };
    if (name.includes('sass') || name.includes('scss')) return { icon: SiSass, color: '#CC6699' };

    // Backend
    if (name.includes('node')) return { icon: FaNode, color: '#339933' };
    if (name.includes('express')) return { icon: SiExpress, color: '#000000' };
    if (name.includes('python')) return { icon: FaPython, color: '#3776AB' };
    if (name.includes('java') && !name.includes('javascript')) return { icon: DiJava, color: '#007396' };
    if (name.includes('c++') || name.includes('cpp')) return { icon: TbBrandCpp, color: '#00599C' };

    // Databases
    if (name.includes('mongo')) return { icon: SiMongodb, color: '#47A248' };
    if (name.includes('mysql')) return { icon: SiMysql, color: '#4479A1' };
    if (name.includes('postgres')) return { icon: SiPostgresql, color: '#4169E1' };
    if (name.includes('redis')) return { icon: SiRedis, color: '#DC382D' };
    if (name.includes('firebase')) return { icon: SiFirebase, color: '#FFCA28' };

    // Tools & Platforms
    if (name.includes('git') && !name.includes('github')) return { icon: FaGitAlt, color: '#F05032' };
    if (name.includes('github')) return { icon: FaGithub, color: '#181717' };
    if (name.includes('docker')) return { icon: FaDocker, color: '#2496ED' };
    if (name.includes('aws')) return { icon: FaAws, color: '#FF9900' };
    if (name.includes('netlify')) return { icon: SiNetlify, color: '#00C7B7' };
    if (name.includes('vercel')) return { icon: SiVercel, color: '#000000' };
    if (name.includes('postman')) return { icon: SiPostman, color: '#FF6C37' };

    // Build Tools & Package Managers
    if (name.includes('webpack')) return { icon: SiWebpack, color: '#8DD6F9' };
    if (name.includes('babel')) return { icon: SiBabel, color: '#F9DC3E' };
    if (name.includes('npm')) return { icon: SiNpm, color: '#CB3837' };
    if (name.includes('yarn')) return { icon: SiYarn, color: '#2C8EBB' };
    if (name.includes('eslint')) return { icon: SiEslint, color: '#4B32C3' };
    if (name.includes('prettier')) return { icon: SiPrettier, color: '#F7B93E' };

    // GraphQL
    if (name.includes('graphql')) return { icon: SiGraphql, color: '#E10098' };

    // Design Tools
    if (name.includes('figma')) return { icon: SiFigma, color: '#F24E1E' };
    if (name.includes('photoshop')) return { icon: SiAdobephotoshop, color: '#31A8FF' };
    if (name.includes('illustrator')) return { icon: SiAdobeillustrator, color: '#FF9A00' };
    if (name.includes('canva')) return { icon: SiCanva, color: '#00C4CC' };

    // Default - return first letter
    return null;
};
