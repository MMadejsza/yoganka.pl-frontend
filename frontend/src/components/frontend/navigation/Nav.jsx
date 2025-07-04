import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSwipe } from '../../../hooks/useSwipe';
import { mutateOnLoginOrSignup, queryClient } from '../../../utils/http.js';
import SymbolOrIcon from '../../common/SymbolOrIcon';
import Logo from '../../frontend/Logo.jsx';

const logsGloballyOn = true;
const menuSet = [
  {
    name: 'Wyjazdy',
    symbol: 'spa', // Represents travel in nature; peaceful and connected to retreats
    link: '/wyjazdy',
  },
  {
    name: 'Wydarzenia',
    symbol: 'event ', // Bell symbolizes mindfulness and yoga-related events
    // link: '/wydarzenia',
    link: '/wydarzenia',
    // scroll: '#wydarzenia',
    // action: smoothScrollInto, //to delete
  },
  {
    name: 'Grafik',
    symbol: 'calendar_month', // Light and informal symbol for easy communication
    link: '/grafik',
  },
  {
    name: 'Dla firm',
    symbol: 'home_work',
    link: '/yoga-dla-firm',
  },
  // {
  //   name: 'Zajęcia',
  //   symbol: 'self_improvement', // Lotus flower symbolizes yoga, harmony, and relaxation
  //   link: '/zajecia',
  // },
];
const menuSideSet = [
  {
    name: 'Instagram',
    icon: 'fa-brands fa-instagram',
    link: 'https://www.instagram.com/tu_yoganka',
  },
  {
    name: 'Facebook',
    icon: 'fa-brands fa-facebook',
    link: 'https://www.facebook.com/profile.php?id=100094192084948',
    scroll: '#wydarzenia',
  },
  {
    auth: true,
    name: 'Zaloguj',
    symbol: 'login',
    link: '/login',
    text: 'Zaloguj się',
  },
  {
    auth: true,
    name: 'Konto',
    symbol: 'account_circle',
    // symbol: 'person',
    link: '/konto',
  },
  {
    auth: true,
    name: 'Admin Panel',
    symbol: 'shield_lock',
    link: '/admin-console/show-all-users',
  },
  {
    auth: true,
    name: 'Wyloguj',
    symbol: 'logout',
    link: '/login-pass/logout',
  },
];

function Nav({ side, status, setIsNavOpen }) {
  if (!status) {
    // it's still loading - you can render a spinner or return null immediately
    return null;
  }
  const navigate = useNavigate();
  const location = useLocation();

  useSwipe(
    side,
    () => setIsNavOpen(true),
    () => setIsNavOpen(false),
    { edgePercent: 0.35, thresholdPercent: 0.1 }
  );

  if (logsGloballyOn) console.log('nav data', status);
  const logoutMutation = useMutation({
    mutationFn: formDataObj =>
      mutateOnLoginOrSignup(status, formDataObj, `/api/login-pass/logout`),

    onSuccess: () => {
      // Invalidate query to reload layout
      queryClient.invalidateQueries(['authStatus']);
      navigate('/');
    },
  });

  const [isMobile, setIsMobile] = useState(false);

  const closeDrawer = () => {
    if (isMobile) setIsNavOpen(false);
  };

  // Limiting touch effectiveness only for mobile devices
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');

    // Function updating based on media query
    const handleMediaChange = e => {
      setIsMobile(e.matches);
    };

    // Initial setup
    handleMediaChange(mediaQuery);

    // Add Listening
    mediaQuery.addEventListener('change', handleMediaChange);

    // Remove on umount
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const liContent = li => {
    // For restricted content
    if (li.auth) {
      // If logged In
      if (status?.isLoggedIn) {
        // Hide LogIn option
        if (li.name === 'Zaloguj') {
          return null;
        }
        if (li.name === 'Admin Panel' && status.user?.role != 'ADMIN') {
          return null;
        }

        // Logout turn into btn triggering fetch
        if (li.name === 'Wyloguj') {
          return (
            <li key={li.name} className='nav__item nav__item--side'>
              <button
                onClick={handleLogout}
                className='nav__link nav__link--side'
              >
                <SymbolOrIcon
                  type={li.icon ? 'ICON' : 'SYMBOL'}
                  specifier={li.icon || li.symbol}
                  classModifier={'side'}
                  aria-hidden={li.icon ? 'true' : null}
                />
                {li.text ?? li.name}
              </button>
            </li>
          );
        }
      } else {
        // If NOT logged in, both account and logout tabs are hidden
        if (
          li.name === 'Konto' ||
          li.name === 'Wyloguj' ||
          li.name === 'Admin Panel'
        ) {
          return null;
        }
      }
    }
    // Rest of elements
    return (
      <li key={li.name} className='nav__item nav__item--side'>
        <Link
          onClick={() => {
            closeDrawer();
            window.scrollTo(0, 0);
          }}
          to={li.link}
          className='nav__link nav__link--side'
        >
          <SymbolOrIcon
            type={li.icon ? 'ICON' : 'SYMBOL'}
            specifier={li.icon || li.symbol}
            classModifier={'side'}
            aria-hidden={li.icon ? 'true' : null}
          />
          {li.text ?? null}
        </Link>
      </li>
    );
  };

  return (
    <nav className={`nav ${side ? 'nav--left' : ''}`}>
      <div className='main-nav-container'>
        <NavLink
          to={'/'}
          onClick={e => {
            closeDrawer();
            window.scrollTo(0, 0);
          }}
          className={({ isActive }) =>
            isActive ? 'nav__link active' : 'nav__link'
          }
        >
          {({ isActive }) => (
            <Logo
              placement='nav'
              media={isMobile ? 'mobile' : null}
              isActive={isActive}
            />
          )}
        </NavLink>
        <ul className='nav__list'>
          {menuSet.map(li => (
            <li key={li.name} className='nav__item'>
              {li.action ? (
                <a
                  onClick={e => {
                    li.action(e, navigate, location);
                    closeDrawer();
                  }}
                  href={li.link}
                  className='nav__link'
                  data-scroll={li.scroll}
                >
                  <SymbolOrIcon
                    type={li.icon ? 'ICON' : 'SYMBOL'}
                    specifier={li.icon || li.symbol}
                  />
                  {li.name}
                </a>
              ) : (
                <NavLink
                  to={li.link}
                  onClick={() => {
                    closeDrawer();
                    window.scrollTo(0, 0);
                  }}
                  className={({ isActive }) =>
                    isActive ? 'nav__link active' : 'nav__link'
                  }
                >
                  {({ isActive }) => (
                    <>
                      <SymbolOrIcon
                        specifier={li.symbol}
                        extraClass={isActive ? 'active' : ''}
                      />
                      {li.name}
                    </>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
      <ul className='nav__list nav__list--side'>
        {menuSideSet.map(li => liContent(li))}
      </ul>
    </nav>
  );
}

export default Nav;
