"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const products = [
    {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        title: "The Legend of Zelda: Breath of the Wild",
        description: "Open-world adventure game with exploration and puzzle-solving",
        price: 59,
        count: 15
    },
    {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
        title: "Cyberpunk 2077",
        description: "Futuristic RPG set in Night City with immersive storyline",
        price: 39,
        count: 8
    },
    {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
        title: "Super Mario Odyssey",
        description: "3D platformer featuring Mario's cap-throwing adventures",
        price: 49,
        count: 12
    },
    {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
        title: "God of War",
        description: "Action-adventure game following Kratos and Atreus in Norse mythology",
        price: 29,
        count: 6
    },
    {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
        title: "Minecraft",
        description: "Sandbox game allowing unlimited creativity and exploration",
        price: 26,
        count: 25
    },
    {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a4",
        title: "Elden Ring",
        description: "Dark fantasy action RPG with challenging combat and open world",
        price: 59,
        count: 4
    },
    {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a5",
        title: "The Witcher 3: Wild Hunt",
        description: "Fantasy RPG with rich storytelling and monster hunting",
        price: 19,
        count: 10
    },
    {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a6",
        title: "Animal Crossing: New Horizons",
        description: "Life simulation game where you build and customize your island",
        price: 54,
        count: 18
    }
];
const handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify(products),
        };
        return response;
    }
    catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFNLFFBQVEsR0FBRztJQUNmO1FBQ0UsRUFBRSxFQUFFLHNDQUFzQztRQUMxQyxLQUFLLEVBQUUseUNBQXlDO1FBQ2hELFdBQVcsRUFBRSwrREFBK0Q7UUFDNUUsS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtLQUNWO0lBQ0Q7UUFDRSxFQUFFLEVBQUUsc0NBQXNDO1FBQzFDLEtBQUssRUFBRSxnQkFBZ0I7UUFDdkIsV0FBVyxFQUFFLDJEQUEyRDtRQUN4RSxLQUFLLEVBQUUsRUFBRTtRQUNULEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFDRDtRQUNFLEVBQUUsRUFBRSxzQ0FBc0M7UUFDMUMsS0FBSyxFQUFFLHFCQUFxQjtRQUM1QixXQUFXLEVBQUUseURBQXlEO1FBQ3RFLEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUNEO1FBQ0UsRUFBRSxFQUFFLHNDQUFzQztRQUMxQyxLQUFLLEVBQUUsWUFBWTtRQUNuQixXQUFXLEVBQUUsc0VBQXNFO1FBQ25GLEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFLENBQUM7S0FDVDtJQUNEO1FBQ0UsRUFBRSxFQUFFLHNDQUFzQztRQUMxQyxLQUFLLEVBQUUsV0FBVztRQUNsQixXQUFXLEVBQUUsNERBQTREO1FBQ3pFLEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUNEO1FBQ0UsRUFBRSxFQUFFLHNDQUFzQztRQUMxQyxLQUFLLEVBQUUsWUFBWTtRQUNuQixXQUFXLEVBQUUsZ0VBQWdFO1FBQzdFLEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFLENBQUM7S0FDVDtJQUNEO1FBQ0UsRUFBRSxFQUFFLHNDQUFzQztRQUMxQyxLQUFLLEVBQUUsMEJBQTBCO1FBQ2pDLFdBQVcsRUFBRSx3REFBd0Q7UUFDckUsS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtLQUNWO0lBQ0Q7UUFDRSxFQUFFLEVBQUUsc0NBQXNDO1FBQzFDLEtBQUssRUFBRSwrQkFBK0I7UUFDdEMsV0FBVyxFQUFFLGdFQUFnRTtRQUM3RSxLQUFLLEVBQUUsRUFBRTtRQUNULEtBQUssRUFBRSxFQUFFO0tBQ1Y7Q0FDRixDQUFDO0FBRUssTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUMxQixLQUEyQixFQUNLLEVBQUU7SUFDbEMsSUFBSSxDQUFDO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEQsTUFBTSxRQUFRLEdBQTBCO1lBQ3RDLFVBQVUsRUFBRSxHQUFHO1lBQ2YsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBRSxrQkFBa0I7Z0JBQ2xDLDZCQUE2QixFQUFFLEdBQUc7Z0JBQ2xDLDhCQUE4QixFQUFFLGNBQWM7Z0JBQzlDLDhCQUE4QixFQUFFLGtCQUFrQjthQUNuRDtZQUNELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztTQUMvQixDQUFDO1FBRUYsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUvQixPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjtnQkFDbEMsNkJBQTZCLEVBQUUsR0FBRztnQkFDbEMsOEJBQThCLEVBQUUsY0FBYztnQkFDOUMsOEJBQThCLEVBQUUsa0JBQWtCO2FBQ25EO1lBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSx1QkFBdUI7YUFDakMsQ0FBQztTQUNILENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBbENXLFFBQUEsT0FBTyxXQWtDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElHYXRld2F5UHJveHlFdmVudCwgQVBJR2F0ZXdheVByb3h5UmVzdWx0IH0gZnJvbSAnYXdzLWxhbWJkYSc7XG5cbmNvbnN0IHByb2R1Y3RzID0gW1xuICB7XG4gICAgaWQ6IFwiNzU2N2VjNGItYjEwYy00OGM1LTkzNDUtZmM3M2M0OGE4MGFhXCIsXG4gICAgdGl0bGU6IFwiVGhlIExlZ2VuZCBvZiBaZWxkYTogQnJlYXRoIG9mIHRoZSBXaWxkXCIsXG4gICAgZGVzY3JpcHRpb246IFwiT3Blbi13b3JsZCBhZHZlbnR1cmUgZ2FtZSB3aXRoIGV4cGxvcmF0aW9uIGFuZCBwdXp6bGUtc29sdmluZ1wiLFxuICAgIHByaWNlOiA1OSxcbiAgICBjb3VudDogMTVcbiAgfSxcbiAge1xuICAgIGlkOiBcIjc1NjdlYzRiLWIxMGMtNDhjNS05MzQ1LWZjNzNjNDhhODBhMFwiLFxuICAgIHRpdGxlOiBcIkN5YmVycHVuayAyMDc3XCIsXG4gICAgZGVzY3JpcHRpb246IFwiRnV0dXJpc3RpYyBSUEcgc2V0IGluIE5pZ2h0IENpdHkgd2l0aCBpbW1lcnNpdmUgc3RvcnlsaW5lXCIsXG4gICAgcHJpY2U6IDM5LFxuICAgIGNvdW50OiA4XG4gIH0sXG4gIHtcbiAgICBpZDogXCI3NTY3ZWM0Yi1iMTBjLTQ4YzUtOTM0NS1mYzczYzQ4YTgwYTJcIixcbiAgICB0aXRsZTogXCJTdXBlciBNYXJpbyBPZHlzc2V5XCIsXG4gICAgZGVzY3JpcHRpb246IFwiM0QgcGxhdGZvcm1lciBmZWF0dXJpbmcgTWFyaW8ncyBjYXAtdGhyb3dpbmcgYWR2ZW50dXJlc1wiLFxuICAgIHByaWNlOiA0OSxcbiAgICBjb3VudDogMTJcbiAgfSxcbiAge1xuICAgIGlkOiBcIjc1NjdlYzRiLWIxMGMtNDhjNS05MzQ1LWZjNzNjNDhhODBhMVwiLFxuICAgIHRpdGxlOiBcIkdvZCBvZiBXYXJcIixcbiAgICBkZXNjcmlwdGlvbjogXCJBY3Rpb24tYWR2ZW50dXJlIGdhbWUgZm9sbG93aW5nIEtyYXRvcyBhbmQgQXRyZXVzIGluIE5vcnNlIG15dGhvbG9neVwiLFxuICAgIHByaWNlOiAyOSxcbiAgICBjb3VudDogNlxuICB9LFxuICB7XG4gICAgaWQ6IFwiNzU2N2VjNGItYjEwYy00OGM1LTkzNDUtZmM3M2M0OGE4MGEzXCIsXG4gICAgdGl0bGU6IFwiTWluZWNyYWZ0XCIsXG4gICAgZGVzY3JpcHRpb246IFwiU2FuZGJveCBnYW1lIGFsbG93aW5nIHVubGltaXRlZCBjcmVhdGl2aXR5IGFuZCBleHBsb3JhdGlvblwiLFxuICAgIHByaWNlOiAyNixcbiAgICBjb3VudDogMjVcbiAgfSxcbiAge1xuICAgIGlkOiBcIjc1NjdlYzRiLWIxMGMtNDhjNS05MzQ1LWZjNzNjNDhhODBhNFwiLFxuICAgIHRpdGxlOiBcIkVsZGVuIFJpbmdcIixcbiAgICBkZXNjcmlwdGlvbjogXCJEYXJrIGZhbnRhc3kgYWN0aW9uIFJQRyB3aXRoIGNoYWxsZW5naW5nIGNvbWJhdCBhbmQgb3BlbiB3b3JsZFwiLFxuICAgIHByaWNlOiA1OSxcbiAgICBjb3VudDogNFxuICB9LFxuICB7XG4gICAgaWQ6IFwiNzU2N2VjNGItYjEwYy00OGM1LTkzNDUtZmM3M2M0OGE4MGE1XCIsXG4gICAgdGl0bGU6IFwiVGhlIFdpdGNoZXIgMzogV2lsZCBIdW50XCIsXG4gICAgZGVzY3JpcHRpb246IFwiRmFudGFzeSBSUEcgd2l0aCByaWNoIHN0b3J5dGVsbGluZyBhbmQgbW9uc3RlciBodW50aW5nXCIsXG4gICAgcHJpY2U6IDE5LFxuICAgIGNvdW50OiAxMFxuICB9LFxuICB7XG4gICAgaWQ6IFwiNzU2N2VjNGItYjEwYy00OGM1LTkzNDUtZmM3M2M0OGE4MGE2XCIsXG4gICAgdGl0bGU6IFwiQW5pbWFsIENyb3NzaW5nOiBOZXcgSG9yaXpvbnNcIixcbiAgICBkZXNjcmlwdGlvbjogXCJMaWZlIHNpbXVsYXRpb24gZ2FtZSB3aGVyZSB5b3UgYnVpbGQgYW5kIGN1c3RvbWl6ZSB5b3VyIGlzbGFuZFwiLFxuICAgIHByaWNlOiA1NCxcbiAgICBjb3VudDogMThcbiAgfVxuXTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhc3luYyAoXG4gIGV2ZW50OiBBUElHYXRld2F5UHJveHlFdmVudFxuKTogUHJvbWlzZTxBUElHYXRld2F5UHJveHlSZXN1bHQ+ID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZygnRXZlbnQ6JywgSlNPTi5zdHJpbmdpZnkoZXZlbnQsIG51bGwsIDIpKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlOiBBUElHYXRld2F5UHJveHlSZXN1bHQgPSB7XG4gICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogJ09QVElPTlMsUE9TVCxHRVQnLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByb2R1Y3RzKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdHVzQ29kZTogNTAwLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUnLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6ICdPUFRJT05TLFBPU1QsR0VUJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG1lc3NhZ2U6ICdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InLFxuICAgICAgfSksXG4gICAgfTtcbiAgfVxufTsiXX0=