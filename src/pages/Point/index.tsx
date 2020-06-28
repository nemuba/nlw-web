import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft,  FiCheckCircle } from 'react-icons/fi';
import {Map, Marker, TileLayer} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';
import logo from './../../assets/logo.svg';
import api from './../../services/api';
import axios from 'axios';
import './styles.css';

interface Item{
  id: number;
  image: string;
  title: string;
}

interface IBGEUFResponse{
  id: number;
  sigla: string;
}

interface IBGEUFCityResponse{
  id: number;
  nome: string;
}

const Point: React.FC = () => {

  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [citys, setCitys] = useState<string[]>([]);

  const [intialPosition, setInitialPosition] = useState<[number,number]>([0,0]);
  const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]);

  const [selectedUF, setSelectedUF] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');

  const [sucess, setSuccess] = useState<Boolean>(false);

  const [formData, setFormData] = useState({
    name:'',
    email:'',
    whatsapp: ''
  });

  const [selectedItem, setSelectedItems] = useState<number[]>([]);
  const history = useHistory();

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position=>{
      const {longitude, latitude} = position.coords;
      setInitialPosition([longitude, latitude]);
    });
  },[]);

  useEffect(()=>{
    api.get('/items').then(response => {
      setItems(response.data);
    });
  },[]);

  useEffect(()=>{
    axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados/").then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  },[]);

  useEffect(()=>{
    if(selectedUF === '0')
      return;

    axios.get<IBGEUFCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
    .then((response) => {
      setCitys(response.data.map((city) => city.nome));
    });

  },[selectedUF])

  const handleChangeCity = (e: ChangeEvent<HTMLSelectElement>) =>{
    const nome = e.target.value;
    setSelectedCity(nome);
  }

  const handleChangeUF = (e: ChangeEvent<HTMLSelectElement>) =>{
    const sigla = e.target.value;
    setSelectedUF(sigla);
  }

  const handleOnClickMap = (event: LeafletMouseEvent) => {
    const {lat, lng} = event.latlng;
    setSelectedPosition([lat, lng]);
  }

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) =>{
    const {name, value} = event.target;
    setFormData({...formData, [name]: value});
  }

  const handleSelectedItems = (id: number) =>{
    const isSelected = selectedItem.findIndex(item => item === id);

    if(isSelected >=0 ){
      const ItemsSelecteds = selectedItem.filter(item => item !== id);
      setSelectedItems(ItemsSelecteds);
    }else{
      setSelectedItems([...selectedItem, id]);
    }
  }

  const handleSubmit = async (event: FormEvent) =>{
    event.preventDefault();
    const {name,email,whatsapp} = formData;
    const [longitude,latitude] = selectedPosition;
    const uf = selectedUF;
    const city = selectedCity;
    const items = selectedItem;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      longitude,
      latitude,
      items
    }

    await api.post('/points', data);

    setSuccess(true);

  }

  return sucess ? (
    <div id="flex-content">
      <div className="box">
        <FiCheckCircle size={64} color="green" />
        <h1 style={{ float: "right", margin: "10px", color: "white" }}>
          Concluido !
        </h1>
        <br />
        <button type="button" className="btn" onClick={() => history.push('/')}>
          <FiArrowLeft />
          <span>Voltar para Home</span>
        </button>
      </div>
    </div>
  ) : (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para a home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome do ponto de coleta</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleChangeInput}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChangeInput}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleChangeInput}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={intialPosition} zoom={15} onclick={handleOnClickMap}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUF}
                onChange={handleChangeUF}
              >
                <option value="0">Selecione</option>
                {ufs?.map((uf) => (
                  <option value={uf} key={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleChangeCity}
              >
                <option value="0">Selecione</option>
                {citys?.map((city) => (
                  <option value={city} key={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítems de coleta</h2>
            <span>Selecione os items de coleta</span>
          </legend>

          <ul className="items-grid">
            {items?.map((item) => (
              <li
                key={item.id}
                className={selectedItem.includes(item.id) ? "selected" : ""}
                onClick={() => handleSelectedItems(item.id)}
              >
                <img src={item.image} alt="Teste" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Point;