import member1 from "@/assets/member1.jpg";
import member2 from "@/assets/member2.jpg";
import member3 from "@/assets/member3.jpg";
import member4 from "@/assets/member4.jpg";
import member5 from "@/assets/member5.jpg";
import member6 from "@/assets/member6.jpg";
import member7 from "@/assets/member7.jpg";
import member8 from "@/assets/member8.jpg";
import member9 from "@/assets/member9.jpg";
import member10 from "@/assets/member10.jpg";
import member11 from "@/assets/member11.jpg";
import member12 from "@/assets/member12.jpg";

export interface Member {
  id: string;
  name: string;
  nameJp: string;
  age: number;
  birthdate: string;
  position: string;
  team: string;
  image: string;
  motto: string;
}

export const members: Member[] = [
  { id: "1", name: "Sakura Hayashi", nameJp: "林 さくら", age: 19, birthdate: "2007-03-15", position: "Center / Vocal", team: "Team A", image: member1, motto: "Sempre brilhar com todo o coração!" },
  { id: "2", name: "Miku Tanaka", nameJp: "田中 みく", age: 18, birthdate: "2008-07-22", position: "Lead Dancer", team: "Team A", image: member2, motto: "A dança é a minha linguagem!" },
  { id: "3", name: "Yuna Watanabe", nameJp: "渡辺 ゆな", age: 20, birthdate: "2006-01-10", position: "Main Vocal", team: "Team B", image: member3, motto: "Cada nota é um sentimento!" },
  { id: "4", name: "Hina Suzuki", nameJp: "鈴木 ひな", age: 17, birthdate: "2009-05-03", position: "Sub Vocal", team: "Team A", image: member4, motto: "O sorriso é a melhor magia!" },
  { id: "5", name: "Riko Yamamoto", nameJp: "山本 りこ", age: 18, birthdate: "2008-11-28", position: "Rapper", team: "Team B", image: member5, motto: "Palavras que tocam a alma!" },
  { id: "6", name: "Aoi Nakamura", nameJp: "中村 あおい", age: 21, birthdate: "2005-09-14", position: "Visual / Vocal", team: "Team A", image: member6, motto: "A beleza está na autenticidade!" },
  { id: "7", name: "Kokone Ito", nameJp: "伊藤 ここね", age: 16, birthdate: "2010-02-20", position: "Maknae / Dancer", team: "Team B", image: member7, motto: "Jovem mas determinada!" },
  { id: "8", name: "Mei Kobayashi", nameJp: "小林 めい", age: 22, birthdate: "2004-08-07", position: "Leader / Vocal", team: "Team A", image: member8, motto: "Liderar com exemplo e amor!" },
  { id: "9", name: "Sora Yoshida", nameJp: "吉田 そら", age: 19, birthdate: "2007-04-18", position: "Lead Vocal", team: "Team B", image: member9, motto: "O céu é o meu limite!" },
  { id: "10", name: "Hana Kimura", nameJp: "木村 はな", age: 20, birthdate: "2006-12-01", position: "Dancer / Visual", team: "Team A", image: member10, motto: "Florescer no palco!" },
  { id: "11", name: "Ren Takahashi", nameJp: "高橋 れん", age: 18, birthdate: "2008-06-25", position: "Rapper / Dancer", team: "Team B", image: member11, motto: "A força vem de dentro!" },
  { id: "12", name: "Yuki Saito", nameJp: "斎藤 ゆき", age: 19, birthdate: "2007-10-30", position: "Sub Vocal / Visual", team: "Team A", image: member12, motto: "Pura como a neve!" },
];
