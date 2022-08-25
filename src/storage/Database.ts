import { WaniKani } from "@/storage/WaniKani";
import { watch, type Ref } from "vue";
import { ref } from "vue";
import Card from "./Card";

type Word = {
  japanese: string; // full word in japanese using kanji, hiragana and katakana
  reading: string; // reading of this word in hiragana
  meanings: string[]; // possible meanings 
  meaning: string; // primary meaning

  // optional fields for now
  wk_id?: number; // WaniKani id
  audio?: string; // link to prononciation audio
  pictch?: string; // pitch pattern for this word
}

const vocabular = new Map<string, Word>();
const vocabularMeaning = new Map<string, Word[]>();
{
  function set(japanese: string, reading: string, meanings: string[], meaning: string) {
    const word = { japanese, reading, meanings, meaning };
    if (vocabular.has(japanese)) { console.error("Duplicate in the dababase: " + japanese); }
    vocabular.set(japanese, word);

    if (!vocabularMeaning.has(meaning)) { vocabularMeaning.set(meaning, []); }
    vocabularMeaning.get(meaning)!.push(word);
  }

  set("私", "わたし", ["me", "i"], "me");
  set("誰", "だれ", ["who"], "who?");
  set("何", "なに", ["what"], "what?");
  set("名前", "なまえ", ["name"], "name");
  set("友達", "ともだち", ["friend"], "friend");
  set("先生", "せんせい", ["teacher"], "teacher");
  set("学生", "がくせい", ["student"], "student");
  set("お母さん", "おかあさん", ["mother"], "mother");
  set("お父さん", "おとうさん", ["father"], "mother");
  set("母", "はは", ["mother"], "mother");
  set("父", "ちち", ["father"], "father");
  set("おじいさん", "おじいさん", ["grandfather", "grandpa"], "grandfather");
  set("おばあさん", "おばあさん", ["grapndmother", "grandma"], "grandmother");
  set("兄", "あに", ["older brother"], "older brother");
  set("妹", "いもうと", ["younger sister"], "younger sister");
  set("家族", "かぞく", ["family"], "family");
  set("日本語", "にほんご", ["japanese", "japanese language"], "japanese");
  set("大人", "おとな", ["adult"], "adult");
  set("一人", "ひとり", ["one person", "alone"], "one person");
  set("人工", "じんこう", ["artificial"], "artificial");
  set("大きい", "おおきい", ["big"], "big");
  set("下", "した", ["down"], "down");
  set("八", "はち", ["eight"], "eight");
  set("八つ", "やっつ", ["eight things"], "eight things");
  set("入り口", "いりぐち", ["entrance", "enter"], "entrance");
  set("大した", "たいした", ["important"], "important");
  set("山", "やま", ["mountain"], "mountain");
  set("口", "くち", ["mouth"], "mouth");
  set("ふじ山", "ふじさん", ["mountain fuji", "fuji"], "mountain Fuji");
  set("九", "く", ["nine"], "nine");
  set("色", "いろ", ["color"], "color");
  set("九つ", "ここのつ", ["nine things"], "nine things");
  set("一", "いち", ["one"], "one");
  set("一つ", "ひとつ", ["one thing"], "one thing");
  set("人", "ひと", ["person"], "person");
  set("下さい", "ください", ["please give me"], "please give me");
  set("人口", "じんこう", ["population"], "population");
  set("力", "ちから", ["power"], "power");
  set("川", "かわ", ["river"], "river");
  set("七", "なな", ["seven"], "seven");
  set("七つ", "ななつ", ["seven thigns"], "seven things");
  set("大きさ", "おおきさ", ["size"], "size");
  set("十", "じゅう", ["ten"], "ten");
  set("三", "さん", ["three"], "three");
  set("三人", "さんにん", ["three people", "three person"], "three people");
  set("三つ", "みっつ", ["three things"], "three things");
  set("入る", "はいる", ["to enter", "enter"], "to enter"),
  set("上げる", "あげる", ["to raise"], "to raise");
  set("下げる", "さげる", ["to lower"], "to lower");
  set("二", "に", ["two"], "two");
  set("二人", "ふたり", ["two people", "two person"], "two people");
  set("二つ", "ふたつ", ["two things"], "two things");
  set("上", "うえ", ["up"], "up");
  set("力いっぱい", "ちからいっぱい", ["full power"], "full power");
  set("女", "おんな", ["woman"], "woman");
}

const monographs = [
  ["あ", "a" ], ["い", "i"  ], ["う", "u"  ], ["え", "e" ], ["お", "o" ], // 4
  ["か", "ka"], ["き", "ki" ], ["く", "ku" ], ["け", "ke"], ["こ", "ko"], // 9
  ["さ", "sa"], ["し", "shi"], ["す", "su" ], ["せ", "se"], ["そ", "so"], // 14
  ["た", "ta"], ["ち", "chi"], ["つ", "tsu"], ["て", "te"], ["と", "to"], // 19
  ["な", "na"], ["に", "ni" ], ["ぬ", "nu" ], ["ね", "ne"], ["の", "no"], // 24
  ["は", "ha"], ["ひ", "hi" ], ["ふ", "fu" ], ["へ", "he"], ["ほ", "ho"], // 29
  ["ま", "ma"], ["み", "mi" ], ["む", "mu" ], ["め", "me"], ["も", "mo"], // 34
  ["や", "ya"], ["ゆ", "yu" ], ["よ", "yo" ], // 37
  ["ら", "ra"], ["り", "ri" ], ["る", "ru" ], ["れ", "re"], ["ろ", "ro"], // 42
  ["わ", "wa"], ["を", "wo" ], // 44
  ["ん", "n" ], // 45
];

const diacritics = [
  ["が", "ga"], ["ぎ", "gi"], ["ぐ", "gu"], ["げ", "ge"], ["ご", "go"], // 4
  ["ざ", "za"], ["じ", "ji"], ["ず", "zu"], ["ぜ", "ze"], ["ぞ", "zo"], // 9
  ["だ", "da"], ["ぢ", "ji"], ["づ", "zu"], ["で", "de"], ["ど", "do"], // 14
  ["ば", "ba"], ["び", "bi"], ["ぶ", "bu"], ["べ", "be"], ["ぼ", "bo"], // 19
  ["ぱ", "pa"], ["ぴ", "pi"], ["ぷ", "pu"], ["ぺ", "pe"], ["ぽ", "po"], // 24
];

const monographs_digraphs = [
  ["きゃ", "kya"], ["きゅ", "kyu"], ["きょ", "kyo"],
  ["しゃ", "sha"], ["しゅ", "shu"], ["しょ", "sho"],
  ["ちゃ", "cha"], ["ちゅ", "chu"], ["ちょ", "cho"],
  ["にゃ", "nya"], ["にゅ", "nyu"], ["にょ", "nyo"],
  ["ひゃ", "hya"], ["ひゅ", "hyu"], ["ひょ", "hyo"],
  ["みゃ", "mya"], ["みゅ", "myu"], ["みょ", "myo"],
  ["りゃ", "rya"], ["りゅ", "ryu"], ["りょ", "ryo"],
];

const diacritics_digraphs = [
  ["ぎゃ", "gya"], ["ぎゅ", "gyu"], ["ぎょ", "gyo"],
  ["じゃ", "jya"], ["じゅ", "jyu"], ["じょ", "jyo"],
  ["ぢゃ", "jya"], ["ぢゅ", "jyu"], ["ぢょ", "jyo"],
  ["びゃ", "bya"], ["びゅ", "byu"], ["びょ", "byo"],
  ["ぴゃ", "pya"], ["ぴゅ", "pyu"], ["ぴょ", "pyo"],
];

const katakana_monographs = [
  ["ア", "a"], ["イ", "i"], ["ウ", "u"], ["エ", "e"], ["オ", "o"], // 4
  ["カ", "ka"], ["キ", "ki"], ["ク", "ku"], ["ケ", "ke"], ["コ", "ko"], // 9
  ["サ", "sa"], ["シ", "shi"], ["ス", "su"], ["セ", "se"], ["ソ", "so"], // 14
  ["タ", "ta"], ["チ", "chi"], ["ツ", "tsu"], ["テ", "te"], ["ト", "to"], // 19
  ["ナ", "na"], ["ニ", "ni"], ["ヌ", "nu"], ["ネ", "ne"], ["ノ", "no"], // 24
  ["ハ", "ha"], ["ヒ", "hi"], ["フ", "fu"], ["ヘ", "he"], ["ホ", "ho"], // 29
  ["マ", "ma"], ["ミ", "mi"], ["ム", "mu"], ["メ", "me"], ["モ", "mo"], // 34
  ["ヤ", "ya"], ["ユ", "yu"], ["ヨ", "yo"], // 37
  ["ラ", "ra"], ["リ", "ri"], ["ル", "ru"], ["レ", "re"], ["ロ", "ro"], // 42
  ["ワ", "wa"], ["ヲ", "wo"], // 44
  ["ン", "n"], // 45
];

const katakana_diacritics = [
  ["ガ", "ga"], ["ギ", "gi"], ["グ", "gu"], ["ゲ", "ge"], ["ゴ", "go"],
  ["ザ", "za"], ["ジ", "ji"], ["ズ", "zu"], ["ゼ", "ze"], ["ゾ", "zo"],
  ["ダ", "da"], ["ヂ", "ji"], ["ヅ", "zu"], ["デ", "de"], ["ド", "do"],
  ["バ", "ba"], ["ビ", "bi"], ["ブ", "bu"], ["ベ", "be"], ["ボ", "bo"],
  ["パ", "pa"], ["ピ", "pi"], ["プ", "pu"], ["ペ", "pe"], ["ポ", "po"],
];

const katakana_monographs_digraphs = [
  ["キャ", "kya"], ["キュ", "kyu"], ["キョ", "kyo"],
  ["シャ", "sha"], ["シュ", "shu"], ["ショ", "sho"],
  ["チャ", "cha"], ["チュ", "chu"], ["チョ", "cho"],
  ["ニャ", "nya"], ["ニュ", "nyu"], ["ニョ", "nyo"],
  ["ヒャ", "hya"], ["ヒュ", "hyu"], ["ヒョ", "hyo"],
  ["ミャ", "mya"], ["ミュ", "myu"], ["ミョ", "myo"],
  ["リャ", "rya"], ["リュ", "ryu"], ["リョ", "ryo"],
];

const katakana_diacritics_digraphs = [
  ["ギャ", "gya"], ["ギュ", "gyu"], ["ギョ", "gyo"],
  ["ジャ", "jya"], ["ジュ", "jyu"], ["ジョ", "jyo"],
  ["ヂャ", "jya"], ["ヂュ", "jyu"], ["ヂョ", "jyo"],
  ["ビャ", "bya"], ["ビュ", "byu"], ["ビョ", "byo"],
  ["ピャ", "pya"], ["ピュ", "pyu"], ["ピョ", "pyo"],
];

const wanikani_l1_vocabular = [
  ["大人", "おとな"],
  ["一人", "ひとり"],
  ["人工", "じんこう"],
  ["大きい", "おおきい"],
  ["下", "した"],
  ["八", "はち"],
  ["八つ", "やっつ"],
  ["入り口", "いりぐち"],
  ["大した", "たいした"],
  ["山", "やま"],
  ["口", "くち"],
  ["ふじ山", "ふじさん"],
  ["九", "く"],
  ["九つ", "ここのつ"],
  ["一", "いち"],
  ["一つ", "ひとつ"],
  ["人", "ひと"],
  ["下さい", "ください"],
  ["人口", "じんこう"],
  ["力", "ちから"],
  ["川", "かわ"],
  ["七", "なな"],
  ["七つ", "ななつ"],
  ["大きさ", "おおきさ"],
  ["十", "じゅう"],
  ["三", "さん"],
  ["三人", "さんにん"],
  ["三つ", "みっつ"],
  ["入る", "はいる"],
  ["上げる", "あげる"],
  ["下げる", "さげる"],
  ["二", "に"],
  ["二人", "ふたり"],
  ["二つ", "ふたつ"],
  ["上", "うえ"],
  ["力いっぱい", "ちからいっぱい"],
  ["女", "おんな"],
];

const wanikani_l2_vocabular = [
  ["四月", "しがつ"],
  ["玉", "たま"],
  ["本", "ほん"],
  ["丸", "まる"],
  ["丸い", "まるい"],
  ["正しい", "ただしい"],
  ["犬", "いぬ"],
  ["八日", "ようか"],
  ["夕べ", "ゆうべ"],
  ["出口", "でぐち"],
  ["目", "め"],
  ["目玉", "めだま"],
  ["二月", "にがつ"],
  ["五日", "いつか"],
  ["五十", "ごじゅう"],
  ["火", "ひ"],
  ["五", "ご"],
  ["五つ", "いつつ"],
  ["四", "よん"],
  ["天才", "てんさい"],
  ["女子", "じょし"],
  ["女の子", "おんなのこ"],
  ["上手", "じょうず"],
  ["手", "て"],
  ["天", "てん"],
  ["入力", "にゅうりょく"],
  ["中", "なか"],
  ["一月", "いちがつ"],
  ["日本", "にほん"],
  ["六月", "ろくがつ"],
  ["子", "こ"],
  ["王", "おう"],
  ["左右", "さゆう"],
  ["左", "ひだり"],
  ["五月", "ごがつ"],
  ["〜円", "えん"],
  ["月", "つき"],
  ["九日", "ここのか"],
  ["十月", "じゅうがつ"],
  ["一日", "いちにち"],
  ["一千", "いっせん"],
  ["千円", "せんえん"],
  ["玉ねぎ", "たまねぎ"],
  ["人々", "ひとびと"],
  ["王子", "おうじ"],
  ["王女", "おうじょ"],
  ["子犬", "こいぬ"],
  ["女王", "じょおう"],
  ["田", "た"],
  ["右", "みぎ"],
  ["円い", "まるい"],
  ["二日", "ふつか"],
  ["七日", "なのか"],
  ["六", "ろく"],
  ["十六", "じゅうろく"],
  ["六日", "むいか"],
  ["六つ", "むっつ"],
  ["小さい", "ちいさい"],
  ["土", "つち"],
  ["日", "ひ"],
  ["刀", "かたな"],
  ["十日", "とおか"],
  ["三日", "みっか"],
  ["千", "せん"],
  ["上る", "のぼる"],
  ["正す", "ただす"],
  ["出る", "でる"],
  ["立つ", "たつ"],
  ["木", "き"],
  ["水中", "すいちゅう"],
  ["下手", "へた"],
  ["中々", "なかなか"],
  ["火山", "かざん"],
  ["水", "みず"],
  ["白", "しろ"],
  ["白人", "はくじん"],
  ["文", "ぶん"],
  ["〜才", "さい"],
];

const kanji_numbers = [
  ["一", "ichi"],
  ["ニ", "ni"],
  ["三", "san"],
  ["四", "yon"],
  ["五", "go"],
  ["六", "roku"],
  ["七", "nana"],
  ["八", "hachi"],
  ["九", "ku"],
  ["十", "jyuu"],
  ["百", "hyaku"],
  ["千", "sen"],
  ["万", "man"],
];

const kanji_numbers_people = [
  ["一人", "ひとり"],
  ["二人", "ふたり"],
  ["三人", "さんにん"],
  ["四人", "よにん"],
  ["五人", "ごにん"],
  ["六人", "ろくにん"],
  ["七人", "しちにん"],
  ["八人", "はちにん"],
  ["九人", "くにん"],
  ["十人", "じゅうにん"],
];

const kanji_numbers_days = [
  ["一日", "いちにち"],
  ["二日", "ふつか"],
  ["三日", "みっか"],
  ["四日", "よっか"],
  ["五日", "いつか"],
  ["六日", "むいか"],
  ["七日", "なのか"],
  ["八日", "ようか"],
  ["九日", "ここのか"],
  ["十日", "とおか"],
];

const kanji_numbers_things = [
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
];

const kanji_numbers_month = [
  ["一月", "いちがつ"],
  ["二月", "にがつ"],
  ["三月", "さんがつ"],
  ["四月", "しがつ"],
  ["五月", "ごがつ"],
  ["六月", "ろくがつ"],
  ["七月", "しちがつ"],
  ["八月", "はちがつ"],
  ["九月", "くがつ"],
  ["十月", "じゅうがつ"],
];

const arabic_numbers = [
  ["1", "ichi"],
  ["2", "ni"],
  ["3", "san"],
  ["4", "yon"],
  ["5", "go"],
  ["6", "roku"],
  ["7", "nana"],
  ["8", "hachi"],
  ["9", "kyuu"],
  ["10", "jyuu"],
];

const jlpt_l1_vocabular = [
  "私", "誰", "何", "名前",
  "友達", "先生", "学生",
  "お母さん", "お父さん", "おじいさん",
  "おばあさん", "兄", "妹",
  "家族", "日本語", "大きい",
  "色", "入口", "上", "内", "円", "大人",
  "女", "女の子", "川", "木", "北",
  "下さい", "口", "下", "上手",
  "〜人", "千", "外", "大切",
  "食べる"
]

export class WanikaniProfile {
  username: string = "";
  level: number = 0;
  api: string = "";
}

class Database {
  hiragana = {
    alphabet: {
      a: monographs.slice(0, 5),
      ka: monographs.slice(5, 10),
      sa: monographs.slice(10, 15),
      ta: monographs.slice(15, 20),
      na: monographs.slice(20, 25),
      ha: monographs.slice(25, 30),
      ma: monographs.slice(30, 35),
      ya: monographs.slice(35, 38),
      ra: monographs.slice(38, 43),
      wa: monographs.slice(43, 46),

      ga: diacritics.slice(0, 5),
      za: diacritics.slice(5, 10),
      da: diacritics.slice(10, 15),
      ba: diacritics.slice(15, 20),
      pa: diacritics.slice(20, 25),

      kya: monographs_digraphs.slice(0, 3),
      sha: monographs_digraphs.slice(3, 6),
      cha: monographs_digraphs.slice(6, 9),
      nya: monographs_digraphs.slice(9, 12),
      hya: monographs_digraphs.slice(12, 15),
      mya: monographs_digraphs.slice(15, 18),
      rya: monographs_digraphs.slice(18, 21),

      gya: diacritics_digraphs.slice(0, 3),
      jya1: diacritics_digraphs.slice(3, 6),
      jya2: diacritics_digraphs.slice(6, 9),
      bya: diacritics_digraphs.slice(9, 12),
      pya: diacritics_digraphs.slice(12, 15),
    },
    monographs: {
      main: monographs,
      digraphs: monographs_digraphs,
      all: monographs.concat(monographs_digraphs),
    },
    diacritics: {
      main: diacritics,
      digraphs: diacritics_digraphs,
      all: diacritics.concat(diacritics_digraphs),
    },
    all: monographs
      .concat(monographs_digraphs)
      .concat(diacritics)
      .concat(diacritics_digraphs),
  };

  katakana = {
    alphabet: {
      a: katakana_monographs.slice(0, 5),
      ka: katakana_monographs.slice(5, 10),
      sa: katakana_monographs.slice(10, 15),
      ta: katakana_monographs.slice(15, 20),
      na: katakana_monographs.slice(20, 25),
      ha: katakana_monographs.slice(25, 30),
      ma: katakana_monographs.slice(30, 35),
      ya: katakana_monographs.slice(35, 38),
      ra: katakana_monographs.slice(38, 43),
      wa: katakana_monographs.slice(43, 46),

      ga: katakana_diacritics.slice(0, 5),
      za: katakana_diacritics.slice(5, 10),
      da: katakana_diacritics.slice(10, 15),
      ba: katakana_diacritics.slice(15, 20),
      pa: katakana_diacritics.slice(20, 25),

      kya: katakana_monographs_digraphs.slice(0, 3),
      sha: katakana_monographs_digraphs.slice(3, 6),
      cha: katakana_monographs_digraphs.slice(6, 9),
      nya: katakana_monographs_digraphs.slice(9, 12),
      hya: katakana_monographs_digraphs.slice(12, 15),
      mya: katakana_monographs_digraphs.slice(15, 18),
      rya: katakana_monographs_digraphs.slice(18, 21),

      gya: katakana_diacritics_digraphs.slice(0, 3),
      jya1: katakana_diacritics_digraphs.slice(3, 6),
      jya2: katakana_diacritics_digraphs.slice(6, 9),
      bya: katakana_diacritics_digraphs.slice(9, 12),
      pya: katakana_diacritics_digraphs.slice(12, 15),
    },
    monographs: {
      main: katakana_monographs,
      digraphs: katakana_monographs_digraphs,
      all: katakana_monographs.concat(katakana_monographs_digraphs),
    },
    diacritics: {
      main: katakana_diacritics,
      digraphs: katakana_diacritics_digraphs,
      all: katakana_diacritics.concat(katakana_diacritics_digraphs),
    },
    all: katakana_monographs
      .concat(katakana_monographs_digraphs)
      .concat(katakana_diacritics)
      .concat(katakana_diacritics_digraphs),
  };

  vocabular = {
    wanikani: [ wanikani_l1_vocabular, wanikani_l2_vocabular ],
    jlpt: [ jlpt_l1_vocabular ]
  };

  wanikaniProfile: Ref<WanikaniProfile | undefined> = ref(undefined);

  wordsReadings(words: string[]) {
    return this.findData(words, (word) => {
      const entry = vocabular.get(word);
      return entry ? Card.create("Reading", entry.japanese, [entry.reading]) : undefined;
    });
  };

  wordsMeanings(words: string[]) {
    return this.findData(words, (word) => {
      const entry = vocabular.get(word);
      return entry ? Card.create("Meaning", entry.japanese, entry.meanings) : undefined;
    });
  };

  meaningsWords(meanings: string[]): Card[] {
    return this.findData(meanings, (meaning) => {
      const words = vocabularMeaning.get(meaning);
      if (words) { return Card.create("Japanese", meaning, words.map(e => e.japanese).concat(words.map(e => e.reading))); }
      return undefined;
    });
  };

  private findData<T>(keys: string[], reader: (key: string) => T | undefined): T[] {
    const requested = new Set<string>();
    return keys.map(key => {
      if (requested.has(key)) { console.error("Requested several times: " + key); return undefined; }
      requested.add(key);
      return reader(key)
    }).filter(e => e).map(e => e!);
  }

  kanaToCards(kana: string[][]) {
    return kana.map(entry => Card.create("Reading", entry[0], [entry[1]]));
  };
};


export const database = new Database();

export function generateCards(entries: Array<Array<string>>): Card[] {
  return entries.map(entry => Card.create("", entry[0], [entry[1]]));
}

// NEW API FOR DATABASE

export class User {
  apiKey: string = "";
  username: string = "";
  level: number = 0;
  paid: boolean = false;
}

type StorageRef<T> = Ref<T | undefined>;

/**
 * Completely reactive storage. Allows you 
 * to wait for values to appear in the storage and react
 * to their changes.
 */
export class Storage {

  // in-memory cache of references
  static cache = new Map<string, Ref<any>>();

  /**
   * Reads entry from the database and if there is no such entry,
   * will read value of that entry from the retriever and save it to
   * the database.
   * 
   * @param key key of entry 
   * @param retriever promise that will return an object to store
   */
  static readOrRequest<T>(key: string, retriever: () => Promise<T>): Promise<Ref<T | undefined>> {
    // Look at saved data
    const saved = Storage.read<T>(key);
    if (saved.value) { return Promise.resolve(saved); }

    // Wait for the value 
    return retriever().then(v => { return Storage.save(key, v); });
  }

  /**
   * Saves entry to the database
   * @param key key of entry
   * @param value actual value of that entry
   */
  static save<T>(key: string, value: T): StorageRef<T> {
    const valueRef = Storage.getCachedRef<T>(key);
    valueRef.value = value;
    localStorage.setItem(key, JSON.stringify(value));
    return valueRef;
  }

  /**
   * Reads data from the database and tries 
   * to return it immidiately (or returns undefined if entry is not found)
   */
  static read<T>(key: string): StorageRef<T> {
    // Look for the reference in the in-memory cache
    const valueRef = Storage.getCachedRef<T>(key);
    if (valueRef.value) { return valueRef; }

    // Now let's look at what browser stores in LocalStorage
    const storageEntry = localStorage.getItem(key);
    if (storageEntry) {
      const value = JSON.parse(storageEntry);
      // if we found something, we will update in-memory
      // reference for that entry
      valueRef.value = value;
    }

    // And return whatever we have in-memory currently
    return valueRef;
  }

  /**
   * Removes any data from both in-memory cache and from the local storage
   */
  static delete(key: string) {
    const valueRef = Storage.getCachedRef(key);
    valueRef.value = undefined;
    localStorage.removeItem(key);
  }

  /**
   * Removes all data from the storage
   */
  static clear() {
    localStorage.clear();
    this.cache.forEach((value) => { value.value = undefined; })
  }

  private static getCachedRef<T>(key: string): StorageRef<T> {
    const cachedRef = this.cache.get(key);
    if (cachedRef) { return cachedRef; }
    
    const newRef = ref<T | undefined>(undefined);
    this.cache.set(key, newRef);
    return newRef as StorageRef<T>;
  }

}

export class Word2 {
  id: number = 0;
  japanese: string = "";
  meanings: string[] = [];
  readings: string[] = [];
  speechParts: string[] = [];
  level: number = 0;

  get primaryMeaning(): string { return this.meanings[0]; } 
  get primaryReading(): string { return this.readings[0]; }
}

export class Dictionary {

  // This is version of our current vocabulary format
  // whenever there is a change to the format of stored vocabulary
  // this value should be incremented
  static databaseRevision: number = 1;

  static vocabulary = new Map<number, Word2>();
  static wanikaniLevels = new Map<number, number[]>();

  /**
   * Loads dictionary from WaniKani (requires user, because it should be logged in)
   */
  static load() {
    // Check if user is logged in
    const userRef = Storage.read<User>("user");
    // If we already have all required data, then 
    // there is no need to perform an update
    if (!userRef.value || this.vocabulary.size > 0) { return; }
    const user = userRef.value!;

    // Get vocabulary
    const rev = this.databaseRevision;
    Storage.readOrRequest("vocabulary-" + rev, () => this.requestVocabulary(user))
      .then(vocabRef => {
        if (vocabRef.value == undefined) { return; }

        // Get every word from vocabulary and move it to 
        // different structures
        const vocab = vocabRef.value!;
        vocab.forEach(word => { 
          this.vocabulary.set(word.id, word as Word2); 
          const level = word.level;
          if (!this.wanikaniLevels.get(level)) { this.wanikaniLevels.set(level, []); }
          this.wanikaniLevels.get(level)!.push(word.id);
        });
        console.log("Dictionary: loaded " + this.vocabulary.size + " words");
      });
  }

  private static requestVocabulary(user: User): Promise<Word2[]> {
    // WaniKani unable to return all database
    // so we need to request vocabulary page by page
    return new Promise(resolver => {
      const pageRequests: Promise<Word2[]>[] = [];

      // Request the first page
      pageRequests.push(this.requestVocabularyWithPage(user, "0", (nextPage) => {
        // Request the next page if it exists
        if (nextPage) {
          pageRequests.push(nextPage);
          return;
        }
        
        // If there are no more pages, we need to take all pages
        // that we have and combine them into one collection of words
        Promise.all(pageRequests).then((responses) => {
          var result: Word2[] = [];
          responses.forEach(response => result = result.concat(response));
          resolver(result);
        });
      }));
    });
  }

  private static requestVocabularyWithPage(user: User, pageId: string, 
      nextPageHandler: (p: Promise<Word2[]> | undefined) => void): Promise<Word2[]> {
    const query = { types: "vocabulary", levels: user.paid ? undefined : "1,2,3", page_after_id: pageId};
    
    return WaniKani.request("subjects", query)
      .then(response => {

        const nextUrl: string = response.pages.next_url;
        if (nextUrl) {
          const id = nextUrl.split("?")[1].split("&")[0].split("=")[1];
          nextPageHandler(this.requestVocabularyWithPage(user, id, nextPageHandler));
        } else {
          nextPageHandler(undefined);
        }

        const result: Word2[] = [];
        for (var wordData of response.data) {
          result.push(this.parseWordData(wordData));
        }
        return result;
      });
  }

  private static parseWordData(wordData: any): Word2 {
    const id = wordData.id;
    const data = wordData.data;
    const word = new Word2();
    word.id = id;
    word.japanese = data.characters;
    word.level = data.level;
        
    var primary = "";
    for (var reading of data.readings) {
      if (!reading.primary) { word.readings.push(reading.reading); }
      else { primary = reading.reading; }
    }
    word.readings = [ primary ].concat(word.readings);

    for (var part of data.parts_of_speech) {
      word.speechParts.push(part);
    }

    primary = "";
    for (var meaning of data.meanings) {
      if (!meaning.primary) { word.meanings.push(meaning.meaning); }
      else { primary = meaning.meaning; }
    }
    word.meanings = [ primary ].concat(word.meanings);
    console.log(word);
    return word;
  }

  /**
   * Creates a collection of cards to review from the content
   * of the dictionary.
   * 
   * @param query - might be a name of the review that should be performed 
   * @param params - different params for different queries
   * @returns collection of cards to review
   */
  static review(query: string, params: any[]): Card[] { return []; }
}

// In case if user is logged in, we want to load all 
// his vocabulary from WaniKani
const userRef = Storage.read<User>("user");
watch(userRef, () => { Dictionary.load(); });