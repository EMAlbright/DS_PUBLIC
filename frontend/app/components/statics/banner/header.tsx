"use client";

import { useState } from "react";
import { LoginButton } from "../../buttons/loginbutton";
import { LogoutButton } from "../../buttons/signoutbutton";
import { SignUpButton } from "../../buttons/signupbutton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserLarge } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import anvil from "../../../../public/forge.png";
import { EditorButton } from "../../buttons/editorbutton";
import { ProjectPageButton } from "../../buttons/Project/projectHomeButton";

export const HeadBanner = () => {
  const [dropMenuVisible, setMenuDropVisible] = useState(false);
  const [dropProfileVisible, setProfileDropVisible] = useState(false);
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  const toggleProfileDrop = () => {
    setProfileDropVisible(!dropProfileVisible);
    setMenuDropVisible(false);
  };

  const toggleMenuDrop = () => {
    setMenuDropVisible(!dropMenuVisible);
    setProfileDropVisible(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-50 flex justify-between items-center">
      {/** spacing between menu bar and profile */}
      <div className="flex items-center space-x-4 pl-2">
      <div className="relative">

          <button onClick={toggleProfileDrop}>
            <FontAwesomeIcon icon={faUserLarge} />
          </button>

          <div className={`absolute left-0 mt-2 flex flex-col space-y-2 text-blue-400 transition-all duration-200 ${
            dropMenuVisible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
          >
            {/** buttons for profile dropdown (view json/apis, settings, etc) */}
          </div>
      </div>

      <div className="relative">

        <button onClick={toggleMenuDrop} className="p-2">
          <FontAwesomeIcon icon={faBars} className="text-white text-2xl" />
        </button>

        <div
          className={`absolute left-0 mt-2 flex flex-col space-y-2 text-blue-400 transition-all duration-200 ${
            dropMenuVisible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <LoginButton />
          <LogoutButton />
          <SignUpButton />
        </div>
      </div>

      <div className="relative">
        <ProjectPageButton />
      </div>

      </div>

      <div>
        <button onClick={goHome} className="text-white-400 text-lg">
            <div className="flex items-center space-x-2">
                <Image src={anvil} alt="Anvil Image" height={50} width={50} />
                <span className="pt-6 text-xl font-bold">DataSmith</span>
            </div>
        </button>
      </div>
    </div>
  );
};
