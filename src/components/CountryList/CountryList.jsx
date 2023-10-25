import styles from "./CountryList.module.css";
import Spinner from "../Spinner/Spinner";
import CountryItem from "../CountryItem/CountryItem";
import Message from "../Message/Message";
import { useCities } from "../../contexts/CitiesContext/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on the city map" />
    );
  const countries = cities.reduce((currentArr, city) => {
    if (!currentArr.map((element) => element.country).includes(city.country))
      return [...currentArr, { country: city.country, emoji: city.emoji }];
    else return currentArr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}
export default CountryList;
