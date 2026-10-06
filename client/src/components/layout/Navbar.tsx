// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLinkHandler } from '@/lib/linkUtils';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { RoleBadge } from '@/components/auth/RolePicker';
import { Button } from '@/components/ui/Button';
import { Languages, LogOut, User, Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { SideMenu } from '@/components/layout/SideMenu';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLinkClick = useLinkHandler();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await api.logout();
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('te') ? 'en' : 'te';
    i18n.changeLanguage(newLang);
  };

  return (
    <>
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a
            href={isAuthenticated ? '/dashboard' : '/'}
            onClick={(e) => handleLinkClick(e, isAuthenticated ? '/dashboard' : '/')}
            className="flex items-center space-x-3"
          >
            <img 
              src="/apmsme_logo.png" 
              alt="APMSME Logo" 
              className="h-12 w-auto object-contain"
            />
            <span className="text-xl font-semibold text-foreground">
              {t('nav.appName')}
            </span>
          </a>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Languages className="h-4 w-4" />
              <span className="font-medium">{i18n.language.startsWith('te') ? 'English' : 'తెలుగు'}</span>
            </Button>

            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <a href="/profile" onClick={(e) => handleLinkClick(e, '/profile')}>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{user?.name}</span>
                      <RoleBadge role={user?.role} />
                    </Button>
                  </a>
                  <a href="/account/privacy" onClick={(e) => handleLinkClick(e, '/account/privacy')}>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="font-medium">{t('nav.privacy')}</span>
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('common.logout')}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <>
                <a href="/login" onClick={(e) => handleLinkClick(e, '/login')}>
                  <Button variant="ghost" size="sm">
                    {t('common.login')}
                  </Button>
                </a>
                <a href="/register" onClick={(e) => handleLinkClick(e, '/register')}>
                  <Button variant="secondary" size="sm">
                    {t('common.register')}
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent text-left"
                >
                  <Languages className="h-4 w-4" />
                  {i18n.language.startsWith('te') ? 'English' : 'తెలుగు'}
                </button>
                <a
                  href="/profile"
                  onClick={(e) => {
                    handleLinkClick(e, '/profile');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                  <RoleBadge role={user?.role} />
                </a>
                <a
                  href="/account/privacy"
                  onClick={(e) => {
                    handleLinkClick(e, '/account/privacy');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t('nav.privacy')}</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 text-left"
                >
                  <LogOut className="h-4 w-4" />
                  {t('common.logout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    {isAuthenticated && <SideMenu />}
    </>
  );
};
