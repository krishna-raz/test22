import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Float, Grid, Stars, Text } from '@react-three/drei';
import { motion } from 'framer-motion';

const HERO_COPY = [
  "Hi, I'm Krishna Raj",
  'Full Stack Web Developer',
  'Smart India Hackathon Winner – 2022 & 2023'
];

const SKILLS = {
  Frontend: ['ReactJS', 'HTML', 'CSS', 'JavaScript'],
  Backend: ['NodeJS', 'ExpressJS', 'PHP'],
  Databases: ['MongoDB', 'MySQL']
};

const PROJECTS = [
  {
    title: 'KnitKraft – Smart India Hackathon 2023 Winner',
    tech: 'NodeJS, MongoDB',
    description:
      'AI-driven knitting workflow platform with automated pattern generation, team collaboration, and secure asset management.'
  },
  {
    title: 'VoCo – Smart India Hackathon 2022 Winner',
    tech: 'Flutter, NodeJS',
    description:
      'Voice-first collaboration app designed for rapid incident reporting and real-time command center visibility.'
  },
  {
    title: 'Home Automation – IoT based web app',
    tech: 'IoT, Web Dashboard',
    description:
      'Unified control panel for smart home devices with realtime monitoring, scheduling, and energy analytics.'
  },
  {
    title: 'Certificate Generation System – Role-based with Socket.IO',
    tech: 'NodeJS, Socket.IO',
    description:
      'Role-based certificate issuance system with real-time progress tracking and secure template workflows.'
  }
];

const EXPERIENCES = [
  {
    role: 'Freelance Certificate System Developer',
    detail: 'Designed end-to-end issuance workflow with realtime updates.'
  },
  {
    role: 'Web Developer at Andes Institute',
    detail: 'Built responsive portals and modernized internal tooling.'
  },
  {
    role: 'Database Admin Trainee at NBPDCL',
    detail: 'Optimized reporting pipelines and database health checks.'
  }
];

const ACHIEVEMENTS = ['Smart India Hackathon Winner 2022', 'Smart India Hackathon Winner 2023'];

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

function useScrollInfluence() {
  const scrollRef = useRef(0);
  React.useEffect(() => {
    const handle = () => {
      scrollRef.current = window.scrollY || 0;
    };
    handle();
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);
  return scrollRef;
}

function LaptopModel() {
  const group = useRef();
  const screenRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const scrollRef = useScrollInfluence();
  const { camera } = useThree();

  React.useEffect(() => {
    const handleMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      mouse.current = { x, y };
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += (mouse.current.x * 0.3 - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (-mouse.current.y * 0.2 - group.current.rotation.x) * 0.05;
    }
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    const scrollOffset = Math.min(scrollRef.current / 600, 1.2);
    camera.position.y = 1.2 + scrollOffset * 0.6;
    camera.position.z = 7 - scrollOffset * 1.2;
    camera.lookAt(0, 0.8, 0);
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[4.5, 0.3, 3]} />
        <meshStandardMaterial color="#121826" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.7, -1.2]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[4, 2.5, 0.2]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={screenRef} position={[0, 0.75, -1.1]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[3.6, 2]} />
        <meshStandardMaterial color="#0b2239" emissive="#4cf4ff" emissiveIntensity={1.2} />
      </mesh>
      <Text
        position={[0, 0.75, -1.0]}
        rotation={[-0.1, 0, 0]}
        fontSize={0.2}
        maxWidth={3.2}
        lineHeight={1.3}
        color="#9bf7ff"
      >
        {'const build = () => {\n  return \"Future-ready\";\n};\n\nexport default build;'}
      </Text>
    </group>
  );
}

function HeroCanvas() {
  return (
    <Canvas camera={{ position: [0, 1.2, 7], fov: 45 }}>
      <color attach="background" args={["#05070e"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 6]} intensity={1.2} color="#6b5cff" />
      <pointLight position={[-4, 3, 2]} intensity={1.1} color="#4cf4ff" />
      <Stars radius={60} depth={40} count={2000} factor={3} saturation={0} fade speed={1} />
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <LaptopModel />
      </Float>
    </Canvas>
  );
}

function SkillOrb() {
  const group = useRef();
  const [activeSkill, setActiveSkill] = useState(null);
  const skills = useMemo(() => {
    const entries = Object.entries(SKILLS).flatMap(([groupName, items]) =>
      items.map((item, index) => ({
        name: item,
        group: groupName,
        index
      }))
    );
    return entries;
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.3;
      group.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={group}>
      {skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const y = Math.sin(angle) * 1.2;
        const x = Math.cos(angle) * 2.2;
        const z = Math.cos(angle * 2) * 0.8;
        const isActive = activeSkill === skill.name;
        return (
          <mesh
            key={skill.name}
            position={[x, y, z]}
            onPointerOver={() => setActiveSkill(skill.name)}
            onPointerOut={() => setActiveSkill(null)}
          >
            <sphereGeometry args={[0.18, 32, 32]} />
            <meshStandardMaterial
              color={isActive ? '#f58bff' : '#2dd4ff'}
              emissive={isActive ? '#f58bff' : '#2dd4ff'}
              emissiveIntensity={isActive ? 1.1 : 0.5}
            />
          </mesh>
        );
      })}
      {activeSkill && (
        <Html center>
          <div className="skill-tooltip">
            <strong>{activeSkill}</strong>
          </div>
        </Html>
      )}
    </group>
  );
}

function SkillsCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <color attach="background" args={["#070a14"]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={1.2} color="#4cf4ff" />
      <SkillOrb />
    </Canvas>
  );
}

function TrophyModel() {
  return (
    <group position={[0, -0.3, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 1.2, 32]} />
        <meshStandardMaterial color="#f9d976" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <torusGeometry args={[0.45, 0.12, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.3, 32]} />
        <meshStandardMaterial color="#2dd4ff" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

function AchievementsCanvas() {
  return (
    <Canvas camera={{ position: [0, 1.6, 5], fov: 45 }}>
      <color attach="background" args={["#070913"]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#f58bff" />
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.7}>
        <TrophyModel />
      </Float>
    </Canvas>
  );
}

function ContactCanvas() {
  return (
    <Canvas camera={{ position: [0, 2, 6], fov: 55 }}>
      <color attach="background" args={["#05070e"]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 4, 4]} intensity={1.1} color="#4cf4ff" />
      <Grid
        args={[10, 10]}
        cellSize={0.4}
        cellThickness={1}
        cellColor="#132238"
        sectionSize={1.6}
        sectionThickness={1.5}
        sectionColor="#4cf4ff"
        fadeDistance={12}
        fadeStrength={1}
        infiniteGrid
      />
    </Canvas>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="section-heading">
      <p className="section-tag">{subtitle}</p>
      <h2>{title}</h2>
    </div>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <button className="project-card" onClick={() => onOpen(project)}>
      <div className="project-card__glow" />
      <div className="project-card__content">
        <h3>{project.title}</h3>
        <p>{project.tech}</p>
        <span>View details</span>
      </div>
    </button>
  );
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{project.title}</h3>
          <button onClick={onClose}>Close</button>
        </div>
        <p className="modal-tech">{project.tech}</p>
        <p>{project.description}</p>
        <div className="modal-actions">
          <button>Live demo</button>
          <button className="ghost">Case study</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <div className="app">
      <header className="hero" id="home">
        <div className="hero-canvas">
          <HeroCanvas />
        </div>
        <div className="hero-content">
          {HERO_COPY.map((line) => (
            <h1 key={line}>{line}</h1>
          ))}
          <p>
            Building high-impact digital experiences with modern full-stack engineering and immersive 3D storytelling.
          </p>
          <div className="hero-actions">
            <a href="#projects">View Projects</a>
            <a className="ghost" href="#contact">
              Let&apos;s Connect
            </a>
          </div>
        </div>
      </header>

      <section className="about" id="about">
        <motion.div
          className="about-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={SECTION_VARIANTS}
        >
          <SectionHeading title="About" subtitle="Professional snapshot" />
          <p>
            B.Tech in Computer Science & Engineering (2020–2024) with CGPA 7.51. Krishna delivers
            end-to-end solutions as a freelance full stack developer focused on scalable web platforms.
          </p>
          <div className="about-grid">
            <div>
              <span>Education</span>
              <strong>B.Tech CSE (2020–2024)</strong>
              <p>CGPA 7.51</p>
            </div>
            <div>
              <span>Role</span>
              <strong>Freelance Full Stack Developer</strong>
              <p>Specialized in web apps and data-driven systems</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="skills" id="skills">
        <SectionHeading title="Skills" subtitle="Tooling & expertise" />
        <div className="skills-layout">
          <div className="skills-canvas">
            <SkillsCanvas />
          </div>
          <div className="skills-list">
            {Object.entries(SKILLS).map(([group, items]) => (
              <div key={group}>
                <h3>{group}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="projects" id="projects">
        <SectionHeading title="Projects" subtitle="Selected work" />
        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} onOpen={setActiveProject} />
          ))}
        </div>
      </section>

      <section className="experience" id="experience">
        <SectionHeading title="Experience" subtitle="Career timeline" />
        <div className="timeline">
          {EXPERIENCES.map((item, index) => (
            <div key={item.role} className="timeline-item">
              <div className="timeline-node" />
              <div className="timeline-content">
                <h3>{item.role}</h3>
                <p>{item.detail}</p>
                <span>2019 - Present</span>
              </div>
              {index < EXPERIENCES.length - 1 && <div className="timeline-line" />}
            </div>
          ))}
        </div>
      </section>

      <section className="achievements" id="achievements">
        <SectionHeading title="Achievements" subtitle="Recognition" />
        <div className="achievements-layout">
          <div className="achievements-canvas">
            <AchievementsCanvas />
          </div>
          <div className="achievements-list">
            {ACHIEVEMENTS.map((achievement) => (
              <div key={achievement} className="achievement-card">
                <h3>{achievement}</h3>
                <p>National recognition for innovation and impactful solutions.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <SectionHeading title="Contact" subtitle="Let&apos;s build together" />
        <div className="contact-grid">
          <div className="contact-form">
            <label>
              Name
              <input type="text" placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" placeholder="you@email.com" />
            </label>
            <label>
              Message
              <textarea placeholder="Tell me about your project" rows="4" />
            </label>
            <button type="button">Send message</button>
            <div className="contact-links">
              <button>Email</button>
              <button>GitHub</button>
              <button>LinkedIn</button>
              <button className="ghost">Download Resume</button>
            </div>
          </div>
          <div className="contact-canvas">
            <ContactCanvas />
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>© 2024 Krishna Raj. Built with React & Three.js.</span>
      </footer>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}
