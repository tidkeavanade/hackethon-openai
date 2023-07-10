echo "The first parameter is: $1"
echo "The second parameter is: $2"
echo "The second parameter is: $3"

# Open a new terminal and run a command
# Run the DotNet Api

cd dotnet-api

# Not to store the keys locally
openAIEndpointURL=$2 openAIKey=$1 openAIKeyEast=$3 dotnet run