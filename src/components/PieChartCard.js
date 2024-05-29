import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {PieChart} from 'react-native-chart-kit';

const apiUrl = 'http://172.20.10.9:9022/product/dashboard/getinventory';

const PieChartCard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(apiData => {
        const totalStockSum = apiData.reduce(
          (sum, category) => sum + category.totalStock,
          0,
        );

        const categoryColors = ['#7a5195', '#003f5c', '#ffa600', '#ef5675'];

        const formattedData = apiData.map((category, index) => ({
          name: category.categoryName,
          percentage: ((category.totalStock / totalStockSum) * 100).toFixed(2),
          population: category.totalStock,
          color: categoryColors[index % categoryColors.length],
        }));
        setData(formattedData);
      })
      .catch(error => console.log('Error fetching data on dashboard :', error));
  }, []);

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 17,
        marginTop: 26,
        elevation: 8,
        borderColor: 'black',
      }}>
      <Text style={{top: -2, left: 10, fontSize: 20, marginBottom: -30}}>
        Inventory in Hand
      </Text>
      <View style={{alignItems: 'center'}}>
        <PieChart
          data={data}
          width={360}
          height={240}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="80"
          absolute
          hasLegend={false}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginTop: -15,
            paddingHorizontal: 15,
          }}>
          {data.map((item, index) => (
            <View
              key={index}
              style={{
                alignItems: 'center',
                marginBottom: 8,
                width: '50%',
              }}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: item.color,
                  borderRadius: 8,
                  marginBottom: -15,
                  marginLeft: -115,
                }}
              />
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginBottom: 5,
                  left: 16,
                  top: -3,
                }}>
                {`${item.name} ${item.percentage}%`}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PieChartCard;
