import { useDrag } from "react-dnd";
import Card from "@mui/material/Card";
import { Pokemon } from "@/types";
import { useEffect, useRef } from "react";
import { Preview } from "react-dnd-preview";
import Image from "next/image";

interface PokeItemProps {
  pokemon: Pokemon;
  onClick?: () => void;
}

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const PokeItem = ({ pokemon, onClick }: PokeItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "POKEMON_CARD",
    item: {
      id: pokemon.id,
      name: pokemon.name,
      engName: pokemon.engName,
      types: pokemon.types,
      description: pokemon.description,
      image: pokemon.image,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [ref, drag]);

  return (
    <>
      {isMobile() && (
        <Preview
          generator={({ itemType, item, style }) => {
            if (itemType === "POKEMON_CARD") {
              const pokemon = item as Pokemon;

              return (
                <div style={{ ...style, zIndex: 9999, pointerEvents: "none" }}>
                  <Card variant="outlined" sx={{ backgroundColor: "#fff" }}>
                    <div
                      style={{
                        display: "flex",
                        width: 120,
                        justifyContent: "center",
                      }}>
                      {pokemon.image && (
                        <Image
                          src={pokemon.image}
                          alt={pokemon.name}
                          width={80}
                          height={80}
                          className="select-none pointer-events-none"
                        />
                      )}
                    </div>
                    <h3 style={{ textAlign: "center", padding: "8px 0" }}>
                      {pokemon.name}
                    </h3>
                  </Card>
                </div>
              ) as unknown as React.ReactElement;
            }

            return null as unknown as React.ReactElement;
          }}
        />
      )}

      <div
        onClick={onClick}
        ref={ref}
        className={`hover:bg-yellow-400 cursor-grab transition-all rounded-[4px] ${
          isDragging ? "hidden" : ""
        }`}>
        <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
          <div className="flex justify-center">
            {pokemon.image && (
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                width={80}
                height={80}
                draggable={false}
                className="select-none pointer-events-none"
              />
            )}
          </div>
          <h3 className="text-center py-2">{pokemon.name}</h3>
        </Card>
      </div>
    </>
  );
};

export default PokeItem;
