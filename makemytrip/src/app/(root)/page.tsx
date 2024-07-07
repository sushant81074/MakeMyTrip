import Image from "next/image";
import Tajawal from "@/public/tajmahal.png";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import Places from "@/components/shared/places";

export default async function Home() {
  return (
    <main className="py-3 px-6 h-full">
      {/* section */}

      <section className="bg-white">
        <div className="py-4 px-2 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full">
            <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-gray-50 h-auto md:h-full flex flex-col">
              <a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
              >
                <Image
                  src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Mumbai_1-1581426168.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  width={2940}
                  height={1960}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                  <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                    Mumbai
                  </h3>
                  <p className="z-10 text-sm font-medium line-clamp-1 text-white">
                    Cosmpolitan and financial capital of India
                  </p>
                </div>
              </a>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-stone-50">
              <a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 mb-4"
              >
                <Image
                  width={2940}
                  height={1960}
                  src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_HoChiMinh-1581456751.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                  <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                    Ho Chi Minh
                  </h3>
                  <p className="z-10 text-sm font-medium line-clamp-1 text-white">
                    Economical, historical and entertainment centre of Vietnam
                  </p>
                </div>
              </a>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
                <a
                  href=""
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                >
                  <Image
                    width={2940}
                    height={1960}
                    src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Paris-1581458044.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                  <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                    <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                      Paris
                    </h3>
                    <p className="z-10 text-sm font-medium line-clamp-1 text-white">
                      The City Of Light{" "}
                    </p>
                  </div>
                </a>
                <a
                  href=""
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                >
                  <Image
                    width={2940}
                    height={1960}
                    src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Krabi-1581455438.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                  <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                    <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                      Krabi
                    </h3>
                    <p className="z-10 text-sm font-medium text-white">
                      A quaint destination featuring endless natural beauty{" "}
                    </p>
                  </div>
                </a>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-1 bg-sky-50 h-auto md:h-full flex flex-col">
              <a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
              >
                <Image
                  width={2940}
                  height={1960}
                  src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Maldives-1581454743.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                  <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                    Maldives
                  </h3>
                  <p className="z-10 text-sm font-medium text-white">
                    An ultimate luxurious and romantic holiday destination{" "}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="py-4 px-2 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full">
            <div className="col-span-2 sm:col-span-1 md:col-span-1 bg-gray-50 h-auto md:h-full flex flex-col">
              <a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
              >
                <Image
                  src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Phuket-1581457448.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  width={2940}
                  height={1960}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                  <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                    Phuket
                  </h3>
                  <p className="z-10 text-sm font-medium text-white">
                    A tropical paradise boasting of stunning beaches
                  </p>
                </div>
              </a>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-3 bg-stone-50">
              <a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 mb-4"
              >
                <Image
                  width={2940}
                  height={1960}
                  src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Bali-1581457806.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                  <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                    Bali
                  </h3>
                  <p className="z-10 text-sm font-medium text-white">
                    Land of the Gods{" "}
                  </p>
                </div>
              </a>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
                <a
                  href=""
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                >
                  <Image
                    width={2940}
                    height={1960}
                    src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Paris-1581458044.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                  <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                    <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                      Paris
                    </h3>
                    <p className="z-10 text-sm font-medium text-white">
                      The city of light{" "}
                    </p>
                  </div>
                </a>
                <a
                  href=""
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                >
                  <Image
                    width={2940}
                    height={1960}
                    src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Hyderabad-1581426329.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                  <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                    <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                      Hyderabad
                    </h3>
                    <p className="z-10 text-sm font-medium text-white">
                      The glorious city of Nizams known for radiant pearls
                    </p>
                  </div>
                </a>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-1 bg-sky-50 h-auto md:h-full flex flex-col">
              <a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
              >
                <Image
                  width={2940}
                  height={1960}
                  src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Udaipur_1-1581427188.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                  <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                    Udaipur
                  </h3>
                  <p className="z-10 text-sm font-medium text-white">
                    Crowned as India's most romantic city
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="py-4 px-2 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full">
            <div className="col-span-2 sm:col-span-1 md:col-span-1 bg-gray-50 h-auto md:h-full flex flex-col">
              <a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
              >
                <Image
                  src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Shimla-1581427547.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  width={2940}
                  height={1960}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                  <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                    Shimla
                  </h3>
                  <p className="z-10 text-sm font-medium text-white">
                    Endearing combination of snow-covered peaks and blue sky
                  </p>
                </div>
              </a>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-stone-50">
              <a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 mb-4"
              >
                <Image
                  width={2940}
                  height={1960}
                  src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Udaipur_1-1581427188.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                  <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                    Ooty
                  </h3>
                  <p className="z-10 text-sm font-medium text-white">
                    Endless natural beauty of the Nilgiris
                  </p>
                </div>
              </a>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3">
                <a
                  href=""
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                >
                  <Image
                    width={2940}
                    height={1960}
                    src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Langkawi_1-1581455345.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                  <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                    <h3 className="z-10 text-sm font-medium text-white xs:text-xl md:text-3xl">
                      LangKawi
                    </h3>
                    <p className="z-10 text-sm font-medium text-white">
                      Picturesque island
                    </p>
                  </div>
                </a>
                <a
                  href=""
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                >
                  <Image
                    width={2940}
                    height={1960}
                    src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Dubai-1581457509.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                  <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                    <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                      Dubai
                    </h3>
                    <p className="z-10 text-sm font-medium text-white">
                      Treasured gem of the Emirates{" "}
                    </p>
                  </div>
                </a>
                <a
                  href=""
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                >
                  <Image
                    width={2940}
                    height={1960}
                    src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Munnar-1581456447.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                  <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                    <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                      Muunar
                    </h3>
                    <p className="z-10 text-sm font-medium text-white">
                      Treasured gem of the Emirates
                    </p>
                  </div>
                </a>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-sky-50 h-auto md:h-full flex flex-col">
              <a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
              >
                <Image
                  width={2940}
                  height={1960}
                  src="https://cdn1.goibibo.com/voy_ing/t_g/New_dWeb_Homepage_Singapore-1581426530.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />

                <div className="w-full whitespace-normal absolute left-0 bottom-0 px-4 py-1">
                  <h3 className="z-10 text-xl font-medium text-white xs:text-xl md:text-3xl">
                    Singapore
                  </h3>
                  <p className="z-10 text-sm font-medium text-white">
                    Treasured gem of the Emirates The city of vast green spaces
                    and glittering skyline
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
