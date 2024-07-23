import api from "../../api/axios";
import Input from "../ui/Input";
import Button from "../ui/Button";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const ProductionChainSortie = () => {
  const [models, setModels] = useState([]);
  const [chains, setChains] = useState([]);
  const [posts, setPosts] = useState([]);
  const [encour, setEncour] = useState(0);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [selectedPost, setSelectedPost] = useState("");

  const [entre, setEntre] = useState(0);
  const [sortie, setSortie] = useState(0);
  const [retouch, setRetouch] = useState(0);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get("/models");
        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    const fetchChains = async () => {
      try {
        const response = await api.get("/chains");
        setChains(response.data);
      } catch (error) {
        console.error("Error fetching chains:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchModels();
    fetchChains();
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchProductionData = async () => {
      if (selectedModel && selectedChain) {
        try {
          const response = await api.get(
            `/chain_production_sortie/${selectedModel}/${selectedChain}`
          );

          console.log(response)

          const { entre, sortie, retouch } = response.data;
          setEntre(entre);
          if(sortie == null) {
            setSortie(0)
          } else {
            setSortie(sortie);
          }
          setRetouch(retouch);
          setEncour(entre - sortie);
        } catch (error) {
          console.error("Error fetching production data:", error);
        }
      }
    };

    fetchProductionData();
  }, [selectedModel, selectedChain]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };

  const handlePostChange = (e) => {
    setSelectedPost(e.target.value);
  };

  const onChange = (name, value) => {
    if (name === "sortie") setSortie(parseInt(value, 10));
    if (name === "retouch") setRetouch(parseInt(value, 10));
  };

  const handleChange = async (direction, type) => {
    let newValue;
    if (type === "sortie") {
      newValue = direction === "next" ? sortie + 1 : sortie - 1;
      if (newValue < 0) newValue = 0;
      if (newValue > entre) {
        toast.error("Sortie cannot be more than Entre");
        return;
      }
      setSortie(newValue);

      try {
        await api.post(`/chain_production/${selectedModel}/${selectedChain}`, {
          sortie: newValue,
        });
        setEncour(entre - newValue);
      } catch (error) {
        console.error("Error updating production data:", error);
      } finally {
        setIsButtonDisabled(false);
      }
    } else if (type === "retouch") {
      newValue = direction === "next" ? retouch + 1 : retouch - 1;
      if (newValue < 0) newValue = 0;
      setRetouch(newValue);
    }
  };

  const handleRetouchSubmit = async () => {
    if (!selectedPost) {
      toast.error("Please select a post before submitting retouch.");
      return;
    }

    try {
      await api.post(`/retouch`, {
        chain_id: selectedChain,
        model_id: selectedModel,
        value: retouch,
        post_id: selectedPost,
      });

      setRetouch(0);
      setSelectedPost("");
    } catch (error) {
      console.error("Error updating retouch data:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Production Chain</h2>
        <div className="ml-7 mb-4 pr-6 flex items-center w-[325px] justify-between">
          <select
            className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedModel}
            onChange={handleModelChange}
          >
            <option value="">Select model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.modele}
              </option>
            ))}
          </select>
          <select
            className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedChain}
            onChange={handleChainChange}
          >
            <option value="">Select Chain</option>
            {chains.map((chain, index) => (
              <option key={index} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedModelData && selectedChain && (
        <div className="w-full pr-6">
          <div
            key={selectedModelData.id}
            className="flex items-center justify-between"
          >
            <h3 className="font-semibold text-xl">
              {selectedModelData.category}
            </h3>
            <h3 className="font-semibold text-xl">
              {selectedModelData.client}
            </h3>
          </div>
          <h3 className="font-semibold text-xl">encour: {encour}</h3>
        </div>
      )}
      <div className="flex justify-between items-center">
        {selectedModel && selectedChain && (
          <div className="flex justify-center mx-auto mt-[2rem] items-center mb-4 shadow-md w-fit p-3 rounded border">
            <button
              className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded mt-9"
              onClick={() => handleChange("prev", "sortie")}
              disabled={isButtonDisabled}
            >
              -
            </button>
            <Input
              handleChange={onChange}
              name={"sortie"}
              placeholder="Sortie"
              label={"Sortie"}
              text={sortie}
            />
            <button
              className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded mt-9"
              onClick={() => handleChange("next", "sortie")}
              disabled={isButtonDisabled}
            >
              +
            </button>
          </div>
        )}
        {selectedModel && selectedChain && (
          <div className="flex justify-center mx-auto mt-[2rem] items-center mb-4 shadow-md w-fit p-3 rounded border">
            <button
              className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded mt-9"
              onClick={() => handleChange("prev", "retouch")}
              disabled={isButtonDisabled}
            >
              -
            </button>
            <Input
              handleChange={onChange}
              name={"retouch"}
              placeholder="Retouch"
              label={"Retouch"}
              text={retouch}
            />
            <button
              className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded mt-9"
              onClick={() => handleChange("next", "retouch")}
              disabled={isButtonDisabled}
            >
              +
            </button>
            <div>
              <label htmlFor="sleect" className="block font-semibold opacity-0">
                .
              </label>
              <select
                id="sleect"
                className="block w-fit mt-4 mr-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
                value={selectedPost}
                onChange={handlePostChange}
                disabled={retouch === 0}
              >
                <option value="">Select Post</option>
                {posts.map((post, index) => (
                  <option key={index} value={post.id}>
                    {post.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              classes={"bg-blue-500 mt-10"}
              handlePress={handleRetouchSubmit}
              disabled={isButtonDisabled}
            >
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionChainSortie;
