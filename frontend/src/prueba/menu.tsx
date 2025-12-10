import { useState } from "react";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

function Menu() {
  const [show, setShow] = useState(false);

  const pathName = window.location.pathname;
  const menuItems = [
    {
      name: "Dashboard Principal",
      path: "/dashboard Principal",
      icon: <SquaresPlusIcon />,
      section: "Resumen",
    },
    {
      name: "Consultas y Reservas",
      path: "/about",
      icon: <ClipboardDocumentListIcon />,
      section: "Gestion",
    },
    {
      name: "Configuracion",
      path: "/",
      icon: <Cog6ToothIcon />,
      section: "Cuenta",
    },
    {
      name: "Salir",
      path: "/contact",
      icon: <ArrowLeftStartOnRectangleIcon />,
      section: "Cuenta",
    },
  ];

  return (
    <div className="relative flex w-full">
      <div className="absolute top-0 left-0 h-12 w-12 sm:hidden">
        <Bars3Icon onClick={() => setShow(!show)} />
      </div>

      <div className={`${!show && "hidden"} h-screen sm:block`}>
        <div className="flex h-full w-full max-w-xs bg-gray-100 p-4">
          <ul className="my-8 flex w-full flex-col sm:my-0">
            <li className="my-px">
              <span className="my-4 flex px-4 text-2xl font-bold text-gray-700 uppercase">
                Menu
              </span>
            </li>
            {menuItems.map((item, index) => {
              const itemPrevius = menuItems[index - 1];
              const showHeader =
                !itemPrevius || itemPrevius.section !== item.section;
              return (
                <>
                  {showHeader && (
                    <li className="my-px">
                      <span className="text-md my-4 flex px-4 font-semibold text-gray-800">
                        {item.section}
                      </span>
                    </li>
                  )}
                  <li className="my-px">
                    <a
                      href={item.path}
                      className={`${pathName === item.path ? "flex h-12 flex-row items-center rounded-lg bg-[#dbeafe] px-4 font-semibold text-[#3755d8]" : "flex h-12 flex-row items-center rounded-lg px-4 font-normal text-gray-800 hover:bg-[#dbeafe]"}`}
                    >
                      <span className="flex items-center justify-center fill-[#3755d8] text-lg">
                        <div className="h-6 w-6">{item.icon}</div>
                      </span>

                      <span className="ml-3">{item.name}</span>
                    </a>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Menu;
