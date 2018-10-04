task default: %[build]

desc "Build project"
task :build do
  puts "Building GraphQL server container ->"
  sh "docker-compose build"
  Dir.chdir("mobile") do
    puts "Installing React Native client dependencies ->"
    sh "npm install"
  end
end

desc "Start GraphQL server"
task :server do
  puts "Starting GraphQL server ->"
  sh "docker-compose up"
end

desc "Launch React Native client"
task :mobile do
  puts "Launching React Native client ->"
  Dir.chdir("mobile") do
    system("npm start")
  end
end
