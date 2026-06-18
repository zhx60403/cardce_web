import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Dock, PhoneShell } from './components/Shell.jsx';
import { AddCardFlowPage } from './pages/AddCardFlowPage.jsx';
import { CardDetailPage } from './pages/CardDetailPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { StatsPage } from './pages/StatsPage.jsx';
import './styles.css';

const routeOrder = { home: 0, addRegion: 1, detail: 2, stats: 3 };

function getRoute(pathname) {
  if (pathname.startsWith('/cards/new/region')) return 'addRegion';
  if (pathname.startsWith('/cards/pulse')) return 'detail';
  if (pathname.startsWith('/stats')) return 'stats';
  return 'home';
}


function HomeStatsShell({ route, direction, prefersReducedMotion, navigate }) {
  const active = route === 'stats' ? 'stats' : 'home';

  return (
    <PhoneShell className={route === 'stats' ? 'stats-page' : 'cards-page'}>
      <AnimatePresence
        mode="wait"
        initial={false}
        custom={{ direction, prefersReducedMotion }}
      >
        <motion.div
          key={route}
          className="tab-content-transition-layer"
          custom={{ direction, prefersReducedMotion }}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: prefersReducedMotion ? 0 : 0.34,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {route === 'stats' ? (
            <StatsPage />
          ) : (
            <HomePage navigate={navigate} />
          )}
        </motion.div>
      </AnimatePresence>
      <Dock active={active} navigate={navigate} />
    </PhoneShell>
  );
}

function App() {
  useViewportScale();
  useGlobalHaptics();

  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
}

function RoutedApp() {
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const routerNavigate = useNavigate();
  const route = getRoute(location.pathname);
  const previousRouteRef = useRef(route);
  const direction = routeOrder[route] - routeOrder[previousRouteRef.current];

  useEffect(() => {
    previousRouteRef.current = route;
  }, [route]);

  const navigate = to => event => {
    if (event) {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
    }

    if (location.pathname === to) return;
    routerNavigate(to);
  };

  if (route === 'home' || route === 'stats') {
    return (
      <Routes location={location}>
        <Route
          path="/"
          element={
            <HomeStatsShell
              route="home"
              direction={direction}
              prefersReducedMotion={prefersReducedMotion}
              navigate={navigate}
            />
          }
        />
        <Route
          path="/stats"
          element={
            <HomeStatsShell
              route="stats"
              direction={direction}
              prefersReducedMotion={prefersReducedMotion}
              navigate={navigate}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      custom={{ direction, prefersReducedMotion }}
    >
      <motion.div
        key={route}
        className="page-transition-layer"
        custom={{ direction, prefersReducedMotion }}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: prefersReducedMotion ? 0 : 0.34,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <Routes location={location}>
          <Route
            path="/cards/new/region"
            element={<AddCardFlowPage navigate={navigate} />}
          />
          <Route path="/cards/pulse" element={<CardDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const pageVariants = {
  enter: ({ direction, prefersReducedMotion }) => ({
    opacity: prefersReducedMotion ? 1 : 0,
    x: prefersReducedMotion ? 0 : Math.sign(direction || 1) * 34,
    scale: prefersReducedMotion ? 1 : 0.985,
    filter: prefersReducedMotion ? 'none' : 'blur(8px)'
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)'
  },
  exit: ({ direction, prefersReducedMotion }) => ({
    opacity: prefersReducedMotion ? 1 : 0,
    x: prefersReducedMotion ? 0 : -Math.sign(direction || 1) * 26,
    scale: prefersReducedMotion ? 1 : 0.99,
    filter: prefersReducedMotion ? 'none' : 'blur(6px)'
  })
};

function useGlobalHaptics() {
  useEffect(() => {
    const handleClick = event => {
      if (event.defaultPrevented || event.button !== 0) return;

      const target = event.target.closest?.('button, a, [role="button"]');
      if (!target) return;
      if (
        target.matches?.(
          'button:disabled, [disabled], [aria-disabled="true"]'
        )
      )
        return;

      navigator.vibrate?.(10);
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);
}

function useViewportScale() {
  useEffect(() => {
    const updateScale = () => {
      const widthRatio = window.innerWidth / 393;
      const heightRatio = window.innerHeight / 852;
      const mobileViewport =
        window.innerWidth <= 600 ||
        window.matchMedia('(hover: none), (pointer: coarse)').matches;
      const scale = mobileViewport
        ? Math.max(widthRatio, heightRatio)
        : Math.min(widthRatio, heightRatio);

      document.documentElement.classList.toggle(
        'mobile-cover',
        mobileViewport
      );
      document.documentElement.style.setProperty('--app-scale', String(scale));
      document.documentElement.style.setProperty(
        '--scaled-width',
        `${393 * scale}px`
      );
      document.documentElement.style.setProperty(
        '--scaled-height',
        `${852 * scale}px`
      );
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, []);
}

createRoot(document.getElementById('root')).render(<App />);
