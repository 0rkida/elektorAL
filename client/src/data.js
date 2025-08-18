import Thumbnail1 from './assets/thumbnail1.png';
import Thumbnail2 from './assets/thumbnail2.png';

import Candidate1 from './assets/candidate1.jpg';
import Candidate2 from './assets/candidate2.jpeg';
import Candidate3 from './assets/candidate3.jpg';
import Candidate4 from './assets/candidate4.jpeg';


export const elections = [
  {
    id: "e1",
    title: "Zgjedhjet për Kryetar Bashkie 2027",
    description: "Zgjidhni kandidatin tuaj për Kryetar Bashkie.",
    thumbnail: Thumbnail1,
    candidates: ["c1", "c2"],
    voters: []
  },
  {
    id: "e2",
    title: "Zgjedhjet për Këshillin Bashkiak 2027",
    description: "Zgjidhni kandidatin tuaj për Këshillin Bashkiak.",
    thumbnail: Thumbnail2,
    candidates: ["c3", "c4"],
    voters: []
  }
];

// Kandidatët
export const candidates = [
  {
    id: "c1",
    name: "Kandidati 1",
    party: "Partia A",
    motto: "Për një qytet më të mirë",
    image: Candidate1,
    voteCount: 20,
    election: "e1",
  },
  {
    id: "c2",
    name: "Kandidati 2",
    party: "Partia B",
    motto: "Bashkë për ndryshim",
    image: Candidate2,
    voteCount: 15,
    election: "e1",
  },
  {
    id: "c3",
    name: "Kandidati 3",
    party: "Partia A",
    motto: "Zëri juaj, fuqia jonë",
    image: Candidate3,
    voteCount: 10,
    election: "e2",
  },
  {
    id: "c4",
    name: "Kandidati 4",
    party: "Partia B",
    motto: "Për një të ardhme më të mirë",
    image: Candidate4,
    voteCount: 25,
    election: "e2",
  }
];


export const voters = [
    {
  id: "v5",
  fullName: "Ardit Leka",
  email: "arditleka@gmail.com",
  password: "ardit123",
  isAdmin: false,
  votedElections: ["e2"]
},
{
  id: "v6",
  fullName: "Erisa Doda",
  email: "erisa.doda@gmail.com",
  password: "erisa123",
  isAdmin: false,
  votedElections: []
},
{
  id: "v7",
  fullName: "Ilir Kola",
  email: "ilir.kola@gmail.com",
  password: "ilir123",
  isAdmin: false,
  votedElections: ["e1"]
},
{
  id: "v8",
  fullName: "Arlinda Pano",
  email: "arlinda.pano@gmail.com",
  password: "arlinda123",
  isAdmin: false,
  votedElections: ["e1", "e2"]
},
{
  id: "v9",
  fullName: "Gentian Hoxha",
  email: "gentian.hoxha@gmail.com",
  password: "gentian123",
  isAdmin: false,
  votedElections: []
}

];
