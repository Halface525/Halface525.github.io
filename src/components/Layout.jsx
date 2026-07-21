import { useTheme } from "../hooks/useTheme";
import { useSearch } from "../hooks/useSearch";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SearchModal } from "./SearchModal";
import { MusicPlayer } from "./MusicPlayer";

export function Layout({ children }) {
  const { isDark, toggleTheme } = useTheme();
  const search = useSearch();
  const music = useMusicPlayer();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onToggleSearch={search.toggle}
        onToggleMusic={() => music.setIsOpen((prev) => !prev)}
      />

      <main className="flex-1">{children}</main>

      <Footer />

      <SearchModal
        isOpen={search.isOpen}
        keyword={search.keyword}
        setKeyword={search.setKeyword}
        results={search.results}
        close={search.close}
        getCategoryLabel={search.getCategoryLabel}
      />

      <MusicPlayer {...music} />
    </div>
  );
}
