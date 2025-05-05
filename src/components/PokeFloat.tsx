import { useDrop } from "react-dnd";
import { useRef, useEffect, useState } from "react";
import { Pokemon, typeMap } from "@/types";
import PokeDrop from "./PokeDrop";
import Button from "@mui/material/Button";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { motion } from "framer-motion";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Image from "next/image";

interface PokeFloatProps {
  filterName: string;
  setFilterName: (value: string) => void;
  filterTypes: string[];
  setFilterTypes: (types: string[]) => void;
}

function extractBetween(text: string, startTag: string, endTag: string) {
  const start = text.indexOf(startTag);
  const end = text.indexOf(endTag);
  if (start === -1 || end === -1) return "";
  return text.slice(start + startTag.length, end).trim();
}

const PokeFloat = ({
  filterName,
  setFilterName,
  filterTypes,
  setFilterTypes,
}: PokeFloatProps) => {
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    winnerImg: string;
    winner: string;
    reason: string;
    score: string;
  }>({
    winnerImg: "",
    winner: "",
    reason: "",
    score: "",
  });

  const [searchValue, setSearchValue] = useState(filterName);

  const ref1 = useRef<HTMLLIElement>(null);
  const ref2 = useRef<HTMLLIElement>(null);

  const [poke1, setPoke1] = useState<Pokemon | null>(null);
  const [poke2, setPoke2] = useState<Pokemon | null>(null);

  const handleReset = () => {
    setPoke1(null);
    setPoke2(null);
  };

  const [{ isOver: isOver1 }, drop1] = useDrop(() => ({
    accept: "POKEMON_CARD",
    drop: (item: Pokemon) => {
      setPoke1(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const [{ isOver: isOver2 }, drop2] = useDrop(() => ({
    accept: "POKEMON_CARD",
    drop: (item: Pokemon) => {
      setPoke2(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterName(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    if (ref1.current) drop1(ref1.current);
    if (ref2.current) drop2(ref2.current);
  }, [drop1, drop2]);

  const handleVS = async () => {
    if (!poke1 || !poke2) return;

    setLoading(true);
    setResult({ winnerImg: "", winner: "", reason: "", score: "" });
    setShowResult(false);

    const prompt = `${poke1.name} - ${poke1?.engName || "Unknown"} (${
      poke1?.types?.join(", ") || "Unknown"
    }) - ${poke1?.description || "No description"}
  VS
  ${poke2.name} - ${poke2.engName} (${poke2?.types?.join(", ")}) - ${
      poke2.description
    }

  이 두 포켓몬이 싸우면 누가 이길지 HTML 태그 형태로 알려줘.
  그리고 실제로 얼마나 박빙으로 싸웠는지 스스로 판단해서 67.2 : 32.8 이런식으로 세밀하게 소수점 자리로 계산하고 최종스코어를 알려줘!
  다음 구조를 꼭 지켜줘:
  
  <result>
    <winnerImg>이긴 포켓몬의 소문자로 영어이름 *내 질문에 있는 영어 그대로</winnerImg>
    <winner>이긴 포켓몬의 한글이름</winner>
    <reason>한글로! 500자 내외로 스토리가 들어간 이유를 이야기해주듯이 흥미진진하게 기술이름을 포함해서 길게 말해줘 느낌표를 써주면 더 좋아!</reason>
    <score>XX : YY *최종 스코어를 백분율로 알려줘 숫자 큰게 XX야</score>
  </result>
`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        }),
      });

      const data = await res.json();
      const aiText = data.choices[0]?.message?.content?.trim() || "";

      const winnerImg = extractBetween(aiText, "<winnerImg>", "</winnerImg>");
      const winner = extractBetween(aiText, "<winner>", "</winner>");
      const reason = extractBetween(aiText, "<reason>", "</reason>");
      const score = extractBetween(aiText, "<score>", "</score>");

      setResult({ winnerImg, winner, reason, score });
      setShowResult(true);
    } catch (err) {
      console.error(err);
      setResult({
        winnerImg: "",
        winner: "",
        reason: "AI 응답에 실패했습니다.",
        score: "",
      });
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-[rgba(255,255,255,0.5)] z-50 flex justify-center items-center">
          <div className="loader"></div>
        </div>
      )}

      <ul className="flex flex-col gap-y-4 bg-white border-[1px] border-b-0 border-[#0000001f] rounded-t-[4px] rounded-r-[4px] fixed p-5 bottom-0 top-auto left-1/2 translate-x-[-50%] w-full max-w-[500px] lg:top-[100px] lg:translate-x-[calc(-100%_-_250px)] lg:w-[300px] lg:border-0 lg:border-transparent ">
        <li>
          <div className="flex justify-end">
            <Button onClick={handleReset}>
              <span className="sr-only">리셋</span>
              <RestartAltRoundedIcon
                fontSize="small"
                sx={{ color: "#000000" }}
              />
            </Button>
          </div>
          <ul className="flex items-start relative">
            {poke1 && poke2 && (
              <motion.button
                type="button"
                onClick={handleVS}
                disabled={loading}
                className="absolute left-1/2 top-[20vw] sm:top-[105px] lg:top-[65px] -translate-1/2 cursor-pointer z-20 hover:bg-[rgba(255,158,141,0.4)] transition p-2 rounded-[5px]"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}>
                <span className="text-[14px] font-bold">Click!</span>
                <Image src="/vs.png" alt="vs아이콘" width={35} height={35} />
              </motion.button>
            )}
            <PokeDrop dropped={poke1} onDrop={setPoke1} />
            <PokeDrop dropped={poke2} onDrop={setPoke2} />
          </ul>
        </li>
      </ul>

      <ul className="hidden flex-col gap-y-4 fixed top-[100px] right-1/2 translate-x-[calc(100%_+_250px)] w-[300px] p-5 lg:flex">
        <li>
          <TextField
            id="outlined-basic"
            label="포켓몬 이름으로 검색하기"
            variant="outlined"
            className="w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </li>
        <li>
          <FormGroup className="!flex-row">
            {Object.entries(typeMap).map(([key, label]) => (
              <FormControlLabel
                className="w-1/2 m-0"
                key={key}
                control={
                  <Checkbox
                    size="small"
                    checked={filterTypes.includes(label)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterTypes([...filterTypes, label]);
                      } else {
                        setFilterTypes(filterTypes.filter((t) => t !== label));
                      }
                    }}
                  />
                }
                label={label}
                sx={{
                  margin: "0px",
                  "& .MuiFormControlLabel-label": { fontSize: 14 },
                }}
              />
            ))}
          </FormGroup>
        </li>
      </ul>

      {showResult && (
        <Modal
          open={true}
          onClose={() => {
            setShowResult(false);
            setPoke1(null);
            setPoke2(null);
          }}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: {
                xs: "95%",
                sm: 500,
              },
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}>
            <div className="flex flex-col items-center justify-center gap-y-5">
              {result.winnerImg && (
                <Image
                  src={`https://projectpokemon.org/images/normal-sprite/${result.winnerImg}.gif`}
                  alt={result.winner}
                  width={120}
                  height={120}
                />
              )}
              <h3 className="text-[20px] font-bold">{result.winner}🏆</h3>
              <p className="text-[14px] font-medium break-keep text-center">
                {result.reason}
              </p>
              <p className="text-gray-500">
                <b className="font-bold text-[#333333]">🎯스코어&nbsp;&nbsp;</b>
                {result.score}
              </p>
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default PokeFloat;
