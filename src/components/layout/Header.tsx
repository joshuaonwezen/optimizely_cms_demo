import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GetCities } from "../../queries/GetCitiesQuery";
import React from "react";
import OptimizelyLogo from "../icons/OptimizelyLogo";
import ContactModal from "../ui/ContactModal";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFlyoutOpen, setFlyoutOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false); // ✅ Modal state
  const router = useRouter();

  const { data } = useQuery(GetCities);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCityClick = (title: string) => {
    const formattedTitle = title.toLowerCase().replace(/\s+/g, "-");
    router.push(`/en/${formattedTitle}`);
  };

  const filteredCities = useMemo(() => {
    if (!data?._Content?.items) return [];
    const seen = new Set<string>();
    return data._Content.items.reduce((unique: any[], city: any) => {
      if (city?.Title && city.Title.trim() !== "" && !seen.has(city.Title)) {
        seen.add(city.Title);
        unique.push(city);
      }
      return unique;
    }, []);
  }, [data]);

  return (
    <>
      <header className="text-white" data-component="header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between" data-component="header-container">
          {/* Logo */}
          <div className="flex items-center space-x-2" data-component="header-logo-wrapper">
            <a href="/en/" className="hover:underline" data-component="header-logo-link">
              <OptimizelyLogo data-component="header-logo" />
            </a>
          </div>

          {/* Navigation Links with Flyout */}
          <nav className="hidden md:flex space-x-6 ml-6 relative" data-component="header-nav">
            <a href="/en/" className="hover:underline" data-component="header-nav-home">Home</a>
            <div
              onMouseEnter={() => setFlyoutOpen(true)}
              onMouseLeave={() => setFlyoutOpen(false)}
              className="relative"
              data-component="header-nav-cities-wrapper"
            >
              <span className="hover:underline cursor-pointer" data-component="header-nav-cities-label">Cities</span>
              {isFlyoutOpen && (
                <div className="absolute top-full left-0 bg-white text-black rounded-lg shadow-lg p-4 w-56 z-10" data-component="header-nav-cities-flyout">
                  <ul className="space-y-2" data-component="header-nav-cities-list">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city: any) => (
                        <li
                          key={city._metadata?.key}
                          className="hover:bg-gray-100 p-2 rounded cursor-pointer transition"
                          onClick={() => handleCityClick(city.Title)}
                          data-component="header-nav-cities-list-item"
                        >
                          {city.Title}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 text-center" data-component="header-nav-cities-list-empty">
                        No cities available
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 justify-center mx-8"
            data-component="header-search-form"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              data-component="header-search-input"
            />
          </form>

          {/* CTA Button with Modal Trigger */}
          <div data-component="header-cta-wrapper">
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => setModalOpen(true)}
              data-component="header-cta-button"
            >
              Contact Us
            </button>
          </div>
        </div>
      </header>

      {/* ✅ Contact Modal Component */}
      {isModalOpen && <ContactModal onClose={() => setModalOpen(false)} data-component="header-contact-modal" />}
    </>
  );
};

export default Header;
