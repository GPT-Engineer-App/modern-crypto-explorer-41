import React, { useState, useEffect } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Hide } from "@chakra-ui/react";
import { exchangeUrls } from "../../../data/ExchangeUrls";

const ExchangeTable = ({ cryptoId }) => {
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await fetch(`https://api.coincap.io/v2/assets/${cryptoId}/markets`);
        const data = await response.json();
        // Filter exchanges to only include those in the supported list
        const filteredExchanges = data.data.filter(exchange => exchange.exchangeId.toLowerCase() in exchangeUrls).slice(0, 3);
        setExchanges(filteredExchanges);
      } catch (error) {
        console.error("Error fetching exchanges:", error);
      }
    };

    fetchExchanges();
  }, [cryptoId]);

  return (
    <Box overflowX="auto" maxWidth="100%" mt={8}>
      <Table variant="simple" width="100%">
        <Thead>
          <Tr>
            <Th px={{ base: 1, md: 4 }}>Rank</Th>
            <Th px={{ base: 1, md: 4 }}>Exchange</Th>
            <Th px={{ base: 1, md: 4 }}>% Total Volume</Th>
            <Hide below="md">
              <Th px={{ base: 1, md: 4 }}>24h Volume (USD)</Th>
            </Hide>
          </Tr>
        </Thead>
        <Tbody fontWeight="bold">
          {exchanges.map((exchange, index) => (
            <Tr
              key={exchange.exchangeId}
              _hover={{ bg: "gray.50", cursor: "pointer" }}
              onClick={() => {
                const exchangeUrl = exchangeUrls[exchange.exchangeId.toLowerCase()];
                if (exchangeUrl) {
                  const url = exchangeUrl.replace("{baseSymbol}", exchange.baseSymbol).replace("{quoteSymbol}", exchange.quoteSymbol);
                  window.open(url, "_blank");
                }
              }}
            >
              <Td px={{ base: 1, md: 4 }}>{index + 1}</Td>
              <Td px={{ base: 1, md: 4 }}>{exchange.exchangeId}</Td>
              <Td color="green.500" px={{ base: 1, md: 4 }}>{parseFloat(exchange.volumePercent).toFixed(2)}%</Td>
              <Hide below="md">
                <Td px={{ base: 1, md: 4 }}>${parseFloat(exchange.volumeUsd24Hr).toLocaleString()}</Td>
              </Hide>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ExchangeTable;
