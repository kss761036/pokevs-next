import { useEffect, useState } from "react";
import PokeItem from "./PokeItem";
import { Pokemon } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Image from "next/image";

interface PokeListProps {
  filterName: string;
  filterTypes: string[];
  initialPokemon: Pokemon[];
}

const PokeList = ({
  filterName,
  filterTypes,
  initialPokemon,
}: PokeListProps) => {
  const [allData] = useState<Pokemon[]>(initialPokemon);
  const [filteredData, setFilteredData] = useState<Pokemon[]>(initialPokemon);
  const [visibleCount, setVisibleCount] = useState(39);

  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const filtered = allData.filter((pokemon) => {
      const nameMatch = pokemon.name.includes(filterName.trim());
      const typeMatch =
        filterTypes.length === 0 ||
        filterTypes.some((type) => (pokemon.types ?? []).includes(type));
      return nameMatch && typeMatch;
    });

    setFilteredData(filtered);
    setVisibleCount(39);
  }, [allData, filterName, filterTypes]);

  const fetchMore = () => {
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12);
    }, 300);
  };

  const pokeData = filteredData.slice(0, visibleCount);

  return (
    <>
      <InfiniteScroll
        dataLength={pokeData.length}
        next={fetchMore}
        hasMore={pokeData.length < filteredData.length}
        loader={<p className="text-center py-4">로딩 중...</p>}
        scrollThreshold={1}>
        <ul className="flex max-w-[500px] mx-auto flex-wrap px-[10px] md:px-0">
          {pokeData.map((pokemon) => (
            <li className="w-1/3 p-1" key={pokemon.id}>
              <PokeItem
                pokemon={pokemon}
                onClick={() => {
                  setSelected(pokemon);
                  setOpen(true);
                }}
              />
            </li>
          ))}
        </ul>
      </InfiniteScroll>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}>
          {selected && (
            <>
              <div className="flex items-center justify-center w-[230px] h-[230px] mx-auto">
                {selected.image && (
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    width={170}
                    height={170}
                    className="mx-auto w-[170px] h-auto"
                  />
                )}
              </div>
              <h2 className="text-xl font-bold text-center">{selected.name}</h2>
              <p className="text-center mt-3 break-keep">
                {selected.description}
              </p>
              <p className="text-center mt-3 text-gray-500">
                {selected.types?.join(", ")}
              </p>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PokeList;
