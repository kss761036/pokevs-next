import "@/styles/globals.css";
import PokeList from "../components/PokeList";
import PokeFloat from "../components/PokeFloat";
import Head from "next/head";
import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchTransition, MouseTransition } from "react-dnd-multi-backend";
import { useState } from "react";
import Image from "next/image";
import { GetStaticProps } from "next";
import { Pokemon, PokemonSpecies, TypeInfo, typeMap } from "@/types";

const customBackend = {
  backends: [
    { backend: HTML5Backend, transition: MouseTransition },
    {
      backend: TouchBackend,
      options: {
        enableMouseEvents: false,
        enableTouchEvents: true,
        delayTouchStart: 100,
      },
      transition: TouchTransition,
      preview: true,
    },
  ],
};

interface HomePageProps {
  initialPokemon: Pokemon[];
}

export default function HomePage({ initialPokemon }: HomePageProps) {
  const [filterName, setFilterName] = useState("");
  const [filterTypes, setFilterTypes] = useState<string[]>([]);

  return (
    <DndProvider backend={MultiBackend} options={customBackend}>
      <div className="relative pb-[300px] lg:pb-[0px]">
        <Head>
          <title>PokeVS</title>
        </Head>
        <div className="flex justify-center py-3 relative">
          <div className="h-[100px] w-[100px] relative">
            <Image src="/logo.png" alt="로고" fill className="object-contain" />
          </div>
          <ul className="absolute top-[10px] right-[10px]">
            <li>
              <a
                className="underline text-[13px] font-semibold"
                href="https://github.com/kss761036/pokevs"
                rel="noopener noreferrer"
                target="_blank">
                깃허브
              </a>
            </li>
          </ul>
        </div>
        <PokeList
          initialPokemon={initialPokemon}
          filterName={filterName}
          filterTypes={filterTypes}
        />
        <PokeFloat
          filterName={filterName}
          setFilterName={setFilterName}
          filterTypes={filterTypes}
          setFilterTypes={setFilterTypes}
        />
      </div>
    </DndProvider>
  );
}

interface PokeAPIListResult {
  name: string;
  url: string;
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=500");
  const data: { results: PokeAPIListResult[] } = await res.json();

  const pokemonList: Pokemon[] = await Promise.all(
    data.results.map(async (pokemon) => {
      const id = parseInt(
        pokemon.url.split("/").filter(Boolean).pop() || "0",
        10
      );

      const [speciesRes, detailRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
          res.json()
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
          res.json()
        ),
      ]);

      const species: PokemonSpecies = speciesRes;
      const koNameEntry = species.names.find((n) => n.language.name === "ko");
      const descriptionEntry = species.flavor_text_entries.find(
        (entry) => entry.language.name === "ko"
      );

      const types: string[] = (detailRes.types as TypeInfo[]).map(
        (t) => typeMap[t.type.name] || t.type.name
      );

      return {
        id,
        name: koNameEntry?.name || pokemon.name,
        url: pokemon.url,
        engName: pokemon.name,
        types,
        image: `https://img.pokemondb.net/sprites/black-white/normal/${pokemon.name}.png`,
        description: descriptionEntry?.flavor_text.replace(/\n|\f/g, " ") || "",
      };
    })
  );

  return {
    props: {
      initialPokemon: pokemonList,
    },
  };
};
