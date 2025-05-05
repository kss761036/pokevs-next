# 🐱‍👤 PokeVS

포켓몬 두 마리를 선택하면, OpenAI GPT가 누가 이길지 예측해주는 AI 대결 시뮬레이터입니다.

![썸네일](./public/thumbnail.png)

---

## 🧩 주요 기능

- 🎯 드래그앤드롭으로 포켓몬 선택
- 🧠 GPT-3.5-turbo를 통한 승부 예측
- ✨ 20% 확률로 이로치 포켓몬 등장
- 🔍 타입·이름 필터로 빠른 검색
- ⚡ 무한스크롤로 최대 500마리까지 로딩

---

## 🚀 기술 스택

- Next.js
- React DnD (드래그앤드롭)
- Framer Motion (애니메이션)
- MUI (UI 컴포넌트)
- OpenAI API (GPT-3.5)

---

## 🛠️ 사용 방법

```bash
# 설치
npm install

# .env.local 파일 설정
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# 실행
npm run dev
```
