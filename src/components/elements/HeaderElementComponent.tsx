import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GetCities } from "@/components/base/visualbuilder/queries/GetCitiesQuery";
import React from "react";
import OptimizelyLogo from "../icons/OptimizelyLogo";
import ContactModalComponent from "./ContactModalComponent";

const HeaderElementComponent = () => {
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
      <header className="text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="/en/" className="hover:underline">
              <OptimizelyLogo />
            </a>
          </div>

          {/* Navigation Links with Flyout */}
          <nav className="hidden md:flex space-x-6 ml-6 relative">
            <a href="/en/" className="hover:underline">
              Home
            </a>
            <div
              onMouseEnter={() => setFlyoutOpen(true)}
              onMouseLeave={() => setFlyoutOpen(false)}
              className="relative"
            >
              <span className="hover:underline cursor-pointer">Cities</span>
              {isFlyoutOpen && (
                <div className="absolute top-full left-0 bg-white text-black rounded-lg shadow-lg p-4 w-56 z-10">
                  <ul className="space-y-2">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city: any) => (
                        <li
                          key={city._metadata?.key}
                          className="hover:bg-gray-100 p-2 rounded cursor-pointer transition"
                          onClick={() => handleCityClick(city.Title)}
                        >
                          {city.Title}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 text-center">
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
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
          </form>

          {/* CTA Button with Modal Trigger */}
          <div>
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => setModalOpen(true)}
            >
              Contact Us
            </button>
          </div>
        </div>
      </header>

      {/* ✅ Contact Modal Component */}
      {isModalOpen && <ContactModalComponent onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default HeaderElementComponent;
