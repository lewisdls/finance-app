import {
  MdFastfood,
  MdLocalGroceryStore,
  MdSpa,
  MdMovie,
} from "react-icons/md";
import { RiBillFill } from "react-icons/ri";
import { FaGasPump, FaUser } from "react-icons/fa";
import { IoBag } from "react-icons/io5";
import { SiYoutubemusic } from "react-icons/si";

export const getColorByCategory = (category: string): string => {
  switch (category) {
    case "Fast Food":
      return "#CA8A04";
    case "Groceries":
      return "#16A34A";
    case "Utilities":
      return "#DC2626";
    case "Gas Stations":
      return "#EA580C";
    case "Clothing":
      return "#9333EA";
    case "Transfers":
      return "#3633ea";
    case "Personal Care":
      return "#008080";
    case "Entertainment":
      return "#03A9F4";
    default:
      return "#cccccc";
  }
};

export const getIconByCategory = (category: string): JSX.Element => {
  switch (category) {
    case "Fast Food":
      return <MdFastfood />;
    case "Groceries":
      return <MdLocalGroceryStore />;
    case "Utilities":
      return <RiBillFill />;
    case "Gas Stations":
      return <FaGasPump />;
    case "Clothing":
      return <IoBag />;
    case "Transfers":
      return <FaUser />;
    case "Personal Care":
      return <MdSpa />;
    case "Entertainment":
      return <MdMovie />;
    case "Streaming":
      return <SiYoutubemusic />;
    default:
      return <IoBag />;
  }
};
