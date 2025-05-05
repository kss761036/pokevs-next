import { useDrop } from "react-dnd";
import Card from "@mui/material/Card";
import { useRef, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Pokemon } from "@/types";
import Image from "next/image";

interface PokeDropProps {
  onDrop: (pokemon: Pokemon) => void;
  dropped: Pokemon | null;
}

const PokeDrop = ({ onDrop, dropped }: PokeDropProps) => {
  const ref = useRef<HTMLLIElement>(null);

  const [loading, setLoading] = useState(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "POKEMON_CARD",
    drop: (item: Pokemon) => {
      setLoading(true);
      const isShiny = Math.random() < 0.2;
      const updated = {
        ...item,
        isShiny,
        image: isShiny
          ? `https://projectpokemon.org/images/shiny-sprite/${
              item.engName
            }.gif?${Date.now()}`
          : `https://projectpokemon.org/images/normal-sprite/${
              item.engName
            }.gif?${Date.now()}`,
      };
      onDrop(updated);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (ref.current) drop(ref.current);
  }, [drop, ref]);

  return (
    <li ref={ref} className={`flex-1 p-1 ${isOver ? "bg-yellow-200" : ""}`}>
      <Card variant="outlined">
        <div className="aspect-1/1 flex items-center justify-center relative">
          {dropped ? (
            <>
              {loading && (
                <div className="absolute w-full h-full flex justify-center items-center bg-white">
                  <CircularProgress size={24} />
                </div>
              )}
              {dropped.image && (
                <Image
                  src={dropped.image}
                  alt={dropped.name || "포켓몬"}
                  width={80}
                  height={80}
                  className="max-w-[80px] h-auto !w-auto"
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                />
              )}
            </>
          ) : (
            <span className="text-gray-400 text-center text-[14px]">
              포켓몬을
              <br />
              드래그 앤 드랍
              <br />
              해보세요!
            </span>
          )}
        </div>
      </Card>
      {loading || !dropped ? (
        <></>
      ) : (
        <>
          <Card variant="outlined" className="text-[12px] font-medium p-2 mt-2">
            <h4 className="text-center py-2 font-bold text-[15px]">
              {dropped && dropped.isShiny && <span>✨</span>}
              {dropped?.name || " "}
            </h4>
            <h5 className="break-keep ">{dropped?.description}</h5>
            <h5 className="mt-1.5 pt-1.5 border-t border-[#dddddd]">
              {dropped?.types}
            </h5>
          </Card>
        </>
      )}
    </li>
  );
};

export default PokeDrop;
