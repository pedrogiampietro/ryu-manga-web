import React from "react";
import { Ratings } from "./custom/starRating";
import { Separator } from "@/components/ui/separator";

interface MangaDetailsProps {
  title: string;
  image: string;
  rating: number;
  reviews: number;
  alternative: string;
  author: string;
  artist: string;
  genres: string[];
  type: string;
  tags: string[];
  releaseYear: string;
  status: string;
}

const MangaDetails: React.FC<MangaDetailsProps> = ({
  title,
  image,
  rating,
  reviews,
  alternative,
  author,
  artist,
  genres,
  type,
  tags,
  releaseYear,
  status,
}) => {
  return (
    <div className="relative p-6 max-w-3xl mx-auto bg-gradient-to-r bg-zinc-900 shadow-lg rounded-lg">
      <div className="absolute top-0 left-0 w-40 h-40 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex items-center space-x-6">
        <img
          src={image}
          alt={`${title} avatar`}
          className="w-24 h-24 rounded-full border-2 border-primary"
        />
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-primary">
            {title}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">{alternative}</p>
        </div>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
          <div>
            <p className="text-lg text-white dark:text-gray-600">
              <strong className="text-primary">Classificação:</strong> {rating}{" "}
              / 5 out of {reviews}
            </p>
            <Ratings rating={rating} />
          </div>

          <p className="text-lg text-white dark:text-gray-600">
            <strong className="text-primary">Autor:</strong> {author}
          </p>
          <p className="text-lg text-white dark:text-gray-600">
            <strong className="text-primary">Artista:</strong> {artist}
          </p>
        </div>

        <div className="flex flex-col">
          <p className="w-max text-lg text-white dark:text-gray-600">
            <strong className="text-primary">Gêneros:</strong>{" "}
            {genres.join(", ")}
          </p>
          <p className="text-lg text-white dark:text-gray-600">
            <strong className="text-primary">Tipo:</strong> {type}
          </p>

          <p className="text-lg text-white dark:text-gray-600">
            <strong className="text-primary">Tags:</strong> {tags.join(", ")}
          </p>
          <p className="text-lg text-white dark:text-gray-600">
            <strong className="text-primary">Publicado:</strong> {releaseYear}
          </p>
          <p className="text-lg text-white dark:text-gray-600">
            <strong className="text-primary">Status:</strong> {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
